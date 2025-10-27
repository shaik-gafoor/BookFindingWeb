/**
 * Open Library API Service
 * Provides functions to search books using the Open Library API
 */

const BASE_URL = "https://openlibrary.org";
const COVERS_BASE_URL = "https://covers.openlibrary.org";

/**
 * Search books with various parameters
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.title - Book title
 * @param {string} searchParams.author - Author name
 * @param {string} searchParams.subject - Subject/genre
 * @param {number} limit - Maximum number of results (default: 100)
 * @returns {Promise<Object>} Search results from Open Library API
 */
export const searchBooks = async ({ title, author, subject }, limit = 100) => {
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

  // Add limit
  params.append("limit", limit);

  // Add fields we want to retrieve
  params.append(
    "fields",
    "key,title,author_name,first_publish_year,cover_i,publisher,isbn,edition_count,language,subject"
  );

  const url = `${BASE_URL}/search.json?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process and clean the data
    return {
      ...data,
      docs: data.docs ? data.docs.map(processBookData) : [],
    };
  } catch (error) {
    console.error("Error searching books:", error);
    throw new Error(
      "Failed to search books. Please check your connection and try again."
    );
  }
};

/**
 * Process and clean book data from API response
 * @param {Object} book - Raw book data from API
 * @returns {Object} Processed book data
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
 * Get book cover URL
 * @param {number|string} coverId - Cover ID from API response
 * @param {string} size - Size: 'S' (small), 'M' (medium), 'L' (large)
 * @returns {string} Cover image URL
 */
export const getCoverUrl = (coverId, size = "M") => {
  if (!coverId) {
    return null;
  }

  const validSizes = ["S", "M", "L"];
  const coverSize = validSizes.includes(size) ? size : "M";

  return `${COVERS_BASE_URL}/b/id/${coverId}-${coverSize}.jpg`;
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
