import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCoverUrl,
  formatAuthors,
  getFallbackCoverUrl,
} from "../services/openLibraryApi";

const BookResults = ({
  books,
  loading,
  error,
  searchInfo,
  isInitialLoad,
  currentPage = 1,
  booksPerPage = 12,
  onPageChange,
  isPageTurning = false,
}) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <span className="ml-3 text-gray-700">Searching for books...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-center text-red-500">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2 text-black">Search Error</h3>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (books.length === 0 && !isInitialLoad) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="text-center text-gray-600">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2 text-black">
            No books found
          </h3>
          <p className="text-gray-700">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = Math.min(startIndex + booksPerPage, books.length);
  const currentBooks = books.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-6 border border-gray-200">
      <div className="mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-black">
          {isInitialLoad ? "Popular Books" : "Search Results"}
        </h2>
        {searchInfo && (
          <p className="text-sm text-gray-600 mt-1">
            {isInitialLoad
              ? `Premium selection of ${books.length} books with guaranteed high-quality cover images`
              : `Showing ${Math.min(currentBooks.length, booksPerPage)} of ${
                  books.length
                } books found${
                  books.length > booksPerPage
                    ? ` (Page ${currentPage} of ${totalPages})`
                    : ""
                }`}
          </p>
        )}
      </div>

      <div
        className={`page-turning ${
          isPageTurning ? "books-grid-turning-out" : "books-grid-turning-in"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {currentBooks.map((book, index) => (
            <BookCard
              key={`${book.key}-${currentPage}-${index}`}
              book={book}
              navigate={navigate}
              isPageTurning={isPageTurning}
              animationDelay={index * 50}
            />
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isPageTurning={isPageTurning}
          totalBooks={books.length}
          currentRange={{ start: startIndex + 1, end: endIndex }}
        />
      )}
    </div>
  );
};

const BookCard = ({ book, navigate, isPageTurning, animationDelay = 0 }) => {
  const {
    title,
    author_name = [],
    first_publish_year,
    cover_i,
    publisher = [],
    isbn = [],
    edition_count,
    language = [],
    key,
  } = book;

  const handleClick = () => {
    if (key) {
      // Extract the book ID from the key (e.g., "/works/OL45804W" -> "OL45804W")
      const bookId = key.split("/").pop();
      navigate(`/book/${bookId}`);
    }
  };

  return (
    <div
      className={`book-card border border-gray-200 bg-white rounded-lg p-2 sm:p-3 md:p-4 hover:shadow-2xl hover:shadow-gray-400/30 hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer ${
        isPageTurning
          ? "book-card-slide-out"
          : "book-card-slide-in animate-fade-in-scale"
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Book Cover */}
      <BookCover coverId={cover_i} title={title} className="mb-2 sm:mb-3" />

      {/* Book Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-black text-sm leading-tight line-clamp-2">
          {title || "Untitled"}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2">
          by {formatAuthors(author_name)}
        </p>

        <div className="space-y-1 text-xs text-gray-600">
          {first_publish_year && <p>Published: {first_publish_year}</p>}

          {publisher.length > 0 && <p>Publisher: {publisher[0]}</p>}

          {edition_count && <p>Editions: {edition_count}</p>}

          {language.length > 0 && (
            <p>Language: {language.slice(0, 2).join(", ")}</p>
          )}
        </div>

        {isbn.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">ISBN: {isbn[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isPageTurning,
  totalBooks,
  currentRange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-4 md:mt-8 bg-gray-50 rounded-xl p-3 md:p-6 border border-gray-200">
      {/* Results Info */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-black">
            {currentRange.start}-{currentRange.end}
          </span>{" "}
          of <span className="font-semibold text-black">{totalBooks}</span>{" "}
          books
        </p>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isPageTurning}
          className="pagination-button flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                >
                  ...
                </span>
              );
            }

            const isCurrentPage = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isPageTurning}
                className={`pagination-button ${
                  isCurrentPage ? "pagination-current" : ""
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isPageTurning}
          className="pagination-button flex items-center space-x-2"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Page Turning Animation Indicator */}
      {isPageTurning && (
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span className="text-sm">Turning page...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Super fast BookCover component - minimal loading time
const BookCover = ({ coverId, title, className = "" }) => {
  const [currentSrc, setCurrentSrc] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!coverId || coverId === -1) {
      setHasError(true);
      return;
    }

    // Get small size URL for fastest loading
    const coverUrl = getCoverUrl(coverId, "S");

    if (!coverUrl) {
      setHasError(true);
      return;
    }

    // Set immediately and let browser handle loading
    setCurrentSrc(coverUrl);
    setHasError(false);
  }, [coverId]);

  const handleImageError = () => {
    console.log(`Image display error for coverId: ${coverId}`);
    setHasError(true);
    setCurrentSrc(null);
  };

  if (hasError || !coverId || coverId === -1) {
    return (
      <div className={`${className} relative`}>
        <div className="w-full h-48 bg-linear-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center shadow-sm">
          <div className="text-center text-gray-500 p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.15L14 17H9zm10-1h-5l-2-2.5L10 17H5l3.5-4.5 1.5 1.8L12 11l5 5z" />
            </svg>
            <div className="text-xs font-medium text-gray-600">
              {title
                ? title.substring(0, 20) + (title.length > 20 ? "..." : "")
                : "No Cover"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {currentSrc && !hasError ? (
        <img
          src={currentSrc}
          alt={`Cover of ${title || "Book"}`}
          className="w-full h-48 object-cover rounded-md bg-gray-100 shadow-sm transition-opacity duration-200"
          onError={() => setHasError(true)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        // Show placeholder immediately for faster display
        <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center shadow-sm">
          <div className="text-center text-gray-400 p-3">
            <svg
              className="w-8 h-8 mx-auto mb-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
            <div className="text-xs font-medium">No Cover</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookResults;
