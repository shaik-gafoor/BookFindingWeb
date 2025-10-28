/**
 * Open Library API Service
 * Provides functions to search books using the Open Library API
 */

// Use proxy URLs in development, direct URLs in production
const BASE_URL = import.meta.env.DEV
  ? "/api/openlibrary"
  : "https://openlibrary.org";
const COVERS_BASE_URL = import.meta.env.DEV
  ? "/api/covers"
  : "https://covers.openlibrary.org";

// Simple cache to speed up repeated searches
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Search books with various parameters
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.title - Book title
 * @param {string} searchParams.author - Author name
 * @param {string} searchParams.subject - Subject/genre
 * @param {number} limit - Maximum number of results (default: 100)
 * @param {number} offset - Number of results to skip for pagination (default: 0)
 * @returns {Promise<Object>} Search results from Open Library API
 */
export const searchBooks = async (
  { title, author, subject },
  limit = 25, // Further reduced for faster loading
  offset = 0
) => {
  // Create cache key
  const cacheKey = JSON.stringify({ title, author, subject, limit, offset });

  // Check cache first
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const params = new URLSearchParams();

  // Add search parameters
  if (title) {
    params.append("title", title.trim());
  }

  if (author) {
    params.append("author", author.trim());
  }

  if (subject) {
    params.append("subject", subject.trim());
  }

  // Add limit and offset for pagination
  params.append("limit", limit);
  params.append("offset", offset);

  // Reduced fields for faster response - only essential data
  params.append("fields", "key,title,author_name,first_publish_year,cover_i");

  const url = `${BASE_URL}/search.json?${params.toString()}`;

  try {
    // Add timeout for faster failure and retry
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      mode: "cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "BookFinder/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Fast processing - minimal operations
    const processedBooks = data.docs
      ? data.docs
          .filter((book) => book.title && (book.cover_i || book.author_name)) // Only books with title and either cover or author
          .slice(0, 15) // Limit to 15 books for fast display
          .map(fastProcessBookData)
      : [];

    const result = {
      ...data,
      docs: processedBooks,
    };

    // Save to cache
    searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error("API search failed, using fallback data:", error);

    // Return fallback data filtered by search criteria
    const fallbackData = getFallbackBooks();

    // Filter fallback data based on search terms
    if (title || author) {
      const searchTerm = (title || "").toLowerCase();
      const authorTerm = (author || "").toLowerCase();

      fallbackData.docs = fallbackData.docs.filter((book) => {
        const matchesTitle =
          !title || book.title.toLowerCase().includes(searchTerm);
        const matchesAuthor =
          !author ||
          (book.author_name &&
            book.author_name.some((a) => a.toLowerCase().includes(authorTerm)));

        return matchesTitle && matchesAuthor;
      });

      fallbackData.numFound = fallbackData.docs.length;
      fallbackData.totalCount = fallbackData.docs.length;
    }

    return fallbackData;
  }
};

/**
 * Fast process book data - minimal operations for speed
 * @param {Object} book - Raw book data from API
 * @returns {Object} Processed book data
 */
const fastProcessBookData = (book) => {
  return {
    key: book.key,
    title: book.title || "Untitled",
    author_name: Array.isArray(book.author_name)
      ? book.author_name.slice(0, 3)
      : [], // Limit to 3 authors
    first_publish_year: book.first_publish_year,
    cover_i: book.cover_i,
  };
};

/**
 * Original process function for detailed views
 */
const processBookData = (book) => {
  return {
    ...book,
    title: book.title || "Untitled",
    author_name: Array.isArray(book.author_name) ? book.author_name : [],
    publisher: Array.isArray(book.publisher) ? book.publisher : [],
    isbn: Array.isArray(book.isbn) ? book.isbn : [],
    language: Array.isArray(book.language) ? book.language : [],
    subject: Array.isArray(book.subject) ? book.subject.slice(0, 5) : [], // Limit subjects to avoid clutter
  };
};

/**
 * Filter books that have cover images
 * @param {Array} books - Array of book objects
 * @returns {Array} Books with cover images
 */
const filterBooksWithCovers = (books) => {
  return books.filter((book) => book.cover_i && book.cover_i !== -1);
};

/**
 * Get book cover URL optimized for fast loading
 * @param {number|string} coverId - Cover ID from API response
 * @param {string} size - Size: 'S' (small), 'M' (medium), 'L' (large)
 * @returns {string|null} Optimized cover image URL
 */
export const getCoverUrl = (coverId, size = "S") => {
  if (!coverId || coverId === -1) {
    return null;
  }

  // Use small size by default for faster loading
  const validSizes = ["S", "M", "L"];
  const coverSize = validSizes.includes(size) ? size : "S";

  return `${COVERS_BASE_URL}/b/id/${coverId}-${coverSize}.jpg`;
};

/**
 * Get a simple cover URL (for backward compatibility) - optimized for speed
 * @param {number|string} coverId - Cover ID from API response
 * @param {string} size - Size: 'S' (small), 'M' (medium), 'L' (large)
 * @returns {string|null} Cover image URL or null if no cover available
 */
export const getSimpleCoverUrl = (coverId, size = "S") => {
  if (!coverId || coverId === -1) {
    return null;
  }

  // Use small size for faster loading
  const validSizes = ["S", "M", "L"];
  const coverSize = validSizes.includes(size) ? size : "S";

  return `${COVERS_BASE_URL}/b/id/${coverId}-${coverSize}.jpg`;
};

/**
 * Get fallback cover URL for books without covers
 * @returns {string} Base64 encoded SVG placeholder
 */
export const getFallbackCoverUrl = () => {
  return (
    "data:image/svg+xml;base64," +
    btoa(`
    <svg width="150" height="200" viewBox="0 0 150 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="200" fill="#F3F4F6"/>
      <rect x="20" y="30" width="110" height="4" fill="#D1D5DB"/>
      <rect x="20" y="50" width="90" height="3" fill="#D1D5DB"/>
      <rect x="20" y="70" width="100" height="3" fill="#D1D5DB"/>
      <rect x="45" y="100" width="60" height="40" fill="#E5E7EB"/>
      <text x="75" y="125" font-family="Arial, sans-serif" font-size="8" fill="#9CA3AF" text-anchor="middle">No Cover</text>
      <text x="75" y="135" font-family="Arial, sans-serif" font-size="8" fill="#9CA3AF" text-anchor="middle">Available</text>
    </svg>
  `)
  );
};

/**
 * Search books by title only
 * @param {string} title - Book title to search for
 * @param {number} limit - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const searchByTitle = async (title, limit = 20) => {
  return searchBooks({ title }, limit);
};

/**
 * Search books by author only
 * @param {string} author - Author name to search for
 * @param {number} limit - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const searchByAuthor = async (author, limit = 20) => {
  return searchBooks({ author }, limit);
};

/**
 * Search books by subject only
 * @param {string} subject - Subject/genre to search for
 * @param {number} limit - Maximum results
 * @returns {Promise<Object>} Search results
 */
export const searchBySubject = async (subject, limit = 20) => {
  return searchBooks({ subject }, limit);
};

/**
 * Get popular/trending books to display initially (10-15 books with guaranteed covers)
 * @param {number} targetCount - Target number of books to return (10-15)
 * @param {number} offset - Number of results to skip for pagination
 * @returns {Promise<Object>} Popular books with covers
 */
export const getPopularBooks = async (targetCount = 12, offset = 0) => {
  // Use the fallback method directly since it's more reliable for finding books with covers
  return await getPopularBooksWithCovers(targetCount, offset);
};

/**
 * Fallback function to get popular books with covers from specific subjects
 * @param {number} targetCount - Target number of books (10-15)
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Books with covers from popular subjects
 */
const getPopularBooksWithCovers = async (targetCount = 12, offset = 0) => {
  // Expanded approach - more sources to ensure at least 12 books
  const reliableQueries = [
    { title: "harry potter" }, // Very popular series
    { author: "stephen king" }, // Popular author
    { author: "agatha christie" }, // Classic mystery
    { title: "lord of the rings" }, // Fantasy classic
    { author: "jane austen" }, // Literature classic
    { title: "sherlock holmes" }, // Detective classic
    { author: "j.k. rowling" }, // Popular author
    { author: "tolkien" }, // Fantasy author
    { author: "dan brown" }, // Thriller author
    { title: "game of thrones" }, // Popular series
    { author: "george martin" }, // Fantasy author
    { subject: "fiction" }, // General fiction
  ];

  let allBooks = [];

  // Try specific popular works that typically have reliable covers
  for (const query of reliableQueries) {
    if (allBooks.length >= targetCount * 3) break; // Get more extras to ensure we have enough

    try {
      const results = await searchBooks(query, 25, 0); // Increased limit
      const booksWithCovers = results.docs.filter(
        (book) =>
          book.cover_i &&
          book.cover_i !== -1 &&
          book.cover_i > 0 &&
          book.cover_i < 8000000 && // Less restrictive cover ID range
          book.title &&
          book.title !== "Untitled" &&
          book.title.length > 2 && // Less restrictive title length
          book.author_name &&
          book.author_name.length > 0 &&
          book.first_publish_year &&
          book.first_publish_year > 1700 && // Extended year range
          book.first_publish_year < 2025 &&
          !book.title.toLowerCase().includes("unnamed")
      );

      allBooks = [...allBooks, ...booksWithCovers];
    } catch (error) {
      console.warn(`Failed to fetch books for query:`, query);
      // Continue to next query without breaking the loop
    }
  }

  // Remove duplicates and sort by cover_i (lower IDs are more reliable)
  const uniqueBooks = allBooks
    .filter(
      (book, index, arr) => arr.findIndex((b) => b.key === book.key) === index
    )
    .sort((a, b) => (a.cover_i || 999999) - (b.cover_i || 999999)); // Sort by cover ID

  // If we don't have enough books, try a broader search
  if (uniqueBooks.length < targetCount) {
    console.log(
      `Only found ${uniqueBooks.length} books, trying broader search...`
    );
    try {
      const broadResults = await searchBooks({ subject: "literature" }, 50, 0);
      const moreBooksWithCovers = broadResults.docs.filter(
        (book) =>
          book.cover_i &&
          book.cover_i !== -1 &&
          book.cover_i > 0 &&
          book.cover_i < 10000000 && // Even less restrictive
          book.title &&
          book.title.length > 1 &&
          book.author_name &&
          book.author_name.length > 0 &&
          // Check if not already in uniqueBooks
          !uniqueBooks.find((existing) => existing.key === book.key)
      );

      uniqueBooks.push(
        ...moreBooksWithCovers.slice(0, targetCount - uniqueBooks.length)
      );
    } catch (error) {
      console.warn("Broader search failed:", error);
    }
  }

  // Take only the target number
  const limitedBooks = uniqueBooks.slice(offset, offset + targetCount);

  return {
    docs: limitedBooks,
    numFound: uniqueBooks.length,
    showing: limitedBooks.length,
  };
};

/**
 * Get detailed book information
 * @param {string} bookKey - Book key/ID from the search results
 * @returns {Promise<Object>} Detailed book information
 */
export const getBookDetails = async (bookKey) => {
  // Clean the book key - ensure it starts with /works/
  let cleanKey = bookKey;
  if (!cleanKey.startsWith("/works/")) {
    if (cleanKey.startsWith("OL") && cleanKey.endsWith("W")) {
      cleanKey = `/works/${cleanKey}`;
    } else {
      cleanKey = `/works/${cleanKey}`;
    }
  }

  const url = `${BASE_URL}${cleanKey}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bookData = await response.json();

    // Also fetch editions to get more complete information
    const editionsUrl = `${BASE_URL}${cleanKey}/editions.json`;
    let editionsData = null;

    try {
      const editionsResponse = await fetch(editionsUrl);
      if (editionsResponse.ok) {
        editionsData = await editionsResponse.json();
      }
    } catch (editionError) {
      console.warn("Could not fetch editions data:", editionError);
    }

    // Combine work data with edition data for more complete information
    const processedBook = {
      ...bookData,
      title: bookData.title || "Untitled",
      author_name: extractAuthors(bookData.authors),
      description: bookData.description,
      first_sentence: bookData.first_sentence,
      subject: Array.isArray(bookData.subjects) ? bookData.subjects : [],
      cover_i: bookData.covers?.[0] || null,
      first_publish_year: bookData.first_publish_date
        ? new Date(bookData.first_publish_date).getFullYear()
        : null,
      // Add edition information if available
      ...(editionsData?.entries?.[0] && {
        publisher: editionsData.entries[0].publishers || [],
        isbn:
          editionsData.entries[0].isbn_13 ||
          editionsData.entries[0].isbn_10 ||
          [],
        language: editionsData.entries[0].languages || [],
        edition_count: editionsData.size || 1,
      }),
    };

    return processedBook;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw new Error(
      "Failed to fetch book details. Please check your connection and try again."
    );
  }
};

/**
 * Extract author information from work data
 * @param {Array} authors - Authors array from work data
 * @returns {Array} Array of author names
 */
const extractAuthors = (authors) => {
  if (!Array.isArray(authors)) return [];

  return authors.map((author) => {
    if (typeof author === "string") return author;
    if (author.author && author.author.key) {
      // We would need another API call to get author name, for now return key
      return author.author.key.split("/").pop();
    }
    return author.name || "Unknown Author";
  });
};

/**
 * Format author names for display
 * @param {Array} authors - Array of author names
 * @returns {string} Formatted author string
 */
export const formatAuthors = (authors) => {
  if (!Array.isArray(authors) || authors.length === 0) {
    return "Unknown Author";
  }

  if (authors.length === 1) {
    return authors[0];
  }

  if (authors.length === 2) {
    return authors.join(" & ");
  }

  return `${authors.slice(0, 2).join(", ")} & ${authors.length - 2} more`;
};

// Fallback data for when API is unavailable
const FALLBACK_BOOKS = [
  {
    key: "/works/OL82563W",
    title: "Harry Potter and the Philosopher's Stone",
    author_name: ["J.K. Rowling"],
    first_publish_year: 1997,
    cover_i: 258027,
  },
  {
    key: "/works/OL27449W",
    title: "The Great Gatsby",
    author_name: ["F. Scott Fitzgerald"],
    first_publish_year: 1925,
    cover_i: 7222246,
  },
  {
    key: "/works/OL103867W",
    title: "To Kill a Mockingbird",
    author_name: ["Harper Lee"],
    first_publish_year: 1960,
    cover_i: 2657175,
  },
  {
    key: "/works/OL1168007W",
    title: "Pride and Prejudice",
    author_name: ["Jane Austen"],
    first_publish_year: 1813,
    cover_i: 1063720,
  },
  {
    key: "/works/OL5735363W",
    title: "The Hobbit",
    author_name: ["J.R.R. Tolkien"],
    first_publish_year: 1937,
    cover_i: 442473,
  },
];

// Function to get fallback books when API fails
export const getFallbackBooks = () => {
  return {
    docs: FALLBACK_BOOKS.map((book) => ({
      ...book,
      cover_url: `${COVERS_BASE_URL}/b/id/${book.cover_i}-M.jpg`,
    })),
    numFound: FALLBACK_BOOKS.length,
    totalCount: FALLBACK_BOOKS.length,
  };
};

/**
 * Example API URLs for reference:
 *
 * Search by title:
 * https://openlibrary.org/search.json?title=harry+potter
 *
 * Search by author:
 * https://openlibrary.org/search.json?author=j.k.+rowling
 *
 * Search by subject:
 * https://openlibrary.org/search.json?subject=science+fiction
 *
 * Combined search:
 * https://openlibrary.org/search.json?title=machine+learning&author=andrew+ng
 *
 * Cover images:
 * https://covers.openlibrary.org/b/id/8231856-L.jpg
 */
