import { useState, useEffect } from "react";
import Hero from "./Hero";
import BookSearch from "./BookSearch";
import BookResults from "./BookResults";
import { searchBooks, getPopularBooks } from "../services/openLibraryApi";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastSearchParams, setLastSearchParams] = useState(null);
  const [isPageTurning, setIsPageTurning] = useState(false);

  const BOOKS_PER_PAGE = 20; // Show all books on one page since we're now getting up to 16 books

  // Load popular books on initial load
  useEffect(() => {
    const loadInitialBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await getPopularBooks(16); // Get 16 books with guaranteed covers for initial display
        setBooks(results.docs || []);
        setSearchInfo({
          total: results.docs?.length || 0,
          showing: Math.min(results.docs?.length || 0, BOOKS_PER_PAGE),
          searchTerms: { subject: "Popular Books" },
        });
        setLastSearchParams({ isInitial: true });
      } catch (err) {
        setError(err.message || "Failed to load books. Please try again.");
        setBooks([]);
        setSearchInfo(null);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadInitialBooks();
  }, []);

  const handleSearch = async (searchParams) => {
    setCurrentPage(1);
    setLoading(true);
    setError(null);
    setIsInitialLoad(false);
    setLastSearchParams(searchParams);

    try {
      const results = await searchBooks(searchParams, 1000); // Allow full search access for user searches
      setBooks(results.docs || []);
      setSearchInfo({
        total: results.numFound || 0,
        showing: Math.min(results.docs?.length || 0, BOOKS_PER_PAGE),
        searchTerms: searchParams,
      });
    } catch (err) {
      setError(err.message || "Failed to search books. Please try again.");
      setBooks([]);
      setSearchInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage === currentPage || isPageTurning) return;

    setIsPageTurning(true);

    // Page turning animation delay
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageTurning(false);

      // Update searchInfo to reflect current page
      if (searchInfo) {
        const startIndex = (newPage - 1) * BOOKS_PER_PAGE;
        const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, books.length);
        setSearchInfo({
          ...searchInfo,
          showing: endIndex - startIndex,
        });
      }
    }, 300);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 animate-fade-in ${
        isDarkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-3 py-6 md:px-4 md:py-12">
        {/* Search Container */}
        <div className="mb-4 md:mb-8 animate-slide-up">
          <BookSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Container */}
        <div className="animate-fade-in-up">
          <BookResults
            books={books}
            loading={loading}
            error={error}
            searchInfo={searchInfo}
            isInitialLoad={isInitialLoad}
            currentPage={currentPage}
            booksPerPage={BOOKS_PER_PAGE}
            onPageChange={handlePageChange}
            isPageTurning={isPageTurning}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
