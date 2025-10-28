import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookDetails,
  getSimpleCoverUrl,
  formatAuthors,
} from "../services/openLibraryApi";
import { useTheme } from "../context/ThemeContext";

const BookDetail = () => {
  const { isDarkMode } = useTheme();
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;

      setLoading(true);
      setError(null);

      try {
        const bookData = await getBookDetails(bookId);
        setBook(bookData);
      } catch (err) {
        setError(err.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`rounded-lg shadow-md p-8 border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-center">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDarkMode ? "border-white" : "border-black"
              }`}
            ></div>
            <span
              className={`ml-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading book details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`rounded-lg shadow-md p-8 border max-w-md text-center ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-red-500 mb-4">
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
          </div>
          <h3
            className={`text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Error Loading Book
          </h3>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {error}
          </p>
          <button
            onClick={handleGoBack}
            className={`px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 max-w-md text-center">
          <h3 className="text-lg font-medium mb-2 text-black">
            Book Not Found
          </h3>
          <p className="text-gray-700 mb-4">
            The requested book could not be found.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <button
            onClick={handleGoBack}
            className={`flex items-center space-x-2 transition-colors ${
              isDarkMode
                ? "text-white hover:text-gray-300"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <svg
              className="w-5 h-5"
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
            <span>Back to Search Results</span>
          </button>
        </div>

        {/* Book Detail Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Book Cover */}
            <div className="flex justify-center animate-fade-in">
              <div className="w-full max-w-sm">
                <BookCoverDetail coverId={book.cover_i} title={book.title} />
              </div>
            </div>

            {/* Book Information */}
            <div className="space-y-6 animate-fade-in-delay">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {book.title || "Untitled"}
                </h1>
                <p className="text-lg text-gray-600">
                  by {formatAuthors(book.author_name || [])}
                </p>
              </div>

              {/* Publication Info */}
              <div className="space-y-3">
                {book.first_publish_year && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">Published:</span>
                    <span className="text-gray-700">
                      {book.first_publish_year}
                    </span>
                  </div>
                )}

                {book.publisher && book.publisher.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">Publisher:</span>
                    <span className="text-gray-700">{book.publisher[0]}</span>
                  </div>
                )}

                {book.edition_count && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">Editions:</span>
                    <span className="text-gray-700">{book.edition_count}</span>
                  </div>
                )}

                {book.language && book.language.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">Language:</span>
                    <span className="text-gray-700">
                      {book.language.slice(0, 3).join(", ")}
                    </span>
                  </div>
                )}

                {book.isbn && book.isbn.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-black">ISBN:</span>
                    <span className="text-gray-700 font-mono">
                      {book.isbn[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Subjects/Genres */}
              {book.subject && book.subject.length > 0 && (
                <div>
                  <h3 className="font-semibold text-black mb-2">Subjects:</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.subject.slice(0, 6).map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200"
                      >
                        {subject}
                      </span>
                    ))}
                    {book.subject.length > 6 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                        +{book.subject.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="font-semibold text-black mb-2">
                    Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {typeof book.description === "string"
                      ? book.description
                      : book.description.value || book.description}
                  </p>
                </div>
              )}

              {/* First Sentence */}
              {book.first_sentence && book.first_sentence.length > 0 && (
                <div>
                  <h3 className="font-semibold text-black mb-2">
                    Opening Line:
                  </h3>
                  <blockquote className="italic text-gray-700 border-l-4 border-gray-300 pl-4">
                    "{book.first_sentence[0]}"
                  </blockquote>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced BookCover component for detail page with timeout handling
const BookCoverDetail = ({ coverId, title }) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timeoutId = null;
    let isCancelled = false;

    if (!coverId || coverId === -1) {
      setLoading(false);
      setError(true);
      return;
    }

    // Start loading
    setLoading(true);
    setError(false);

    // Get cover URL - use Large size for detail page
    const coverUrl = getSimpleCoverUrl(coverId, "L");

    if (!coverUrl) {
      setLoading(false);
      setError(true);
      return;
    }

    // Set timeout for image loading - 3 seconds max
    timeoutId = setTimeout(() => {
      if (!isCancelled) {
        console.log(`Image timeout for coverId: ${coverId}`);
        setError(true);
        setLoading(false);
      }
    }, 3000);

    // Preload image to test if it's available
    const testImg = new Image();
    testImg.onload = () => {
      if (!isCancelled) {
        clearTimeout(timeoutId);
        setSrc(coverUrl);
        setLoading(false);
        setError(false);
      }
    };

    testImg.onerror = () => {
      if (!isCancelled) {
        clearTimeout(timeoutId);
        console.log(`Image failed to load for coverId: ${coverId}`);
        // Try medium size as fallback
        const fallbackUrl = getSimpleCoverUrl(coverId, "M");
        if (fallbackUrl !== coverUrl) {
          testImg.src = fallbackUrl;
        } else {
          setError(true);
          setLoading(false);
        }
      }
    };

    testImg.src = coverUrl;

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [coverId]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading cover...</div>
        </div>
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.15L14 17H9zm10-1h-5l-2-2.5L10 17H5l3.5-4.5 1.5 1.8L12 11l5 5z" />
          </svg>
          <div className="text-lg font-medium text-gray-600 mb-2">
            {title
              ? title.substring(0, 30) + (title.length > 30 ? "..." : "")
              : "Book Cover"}
          </div>
          <div className="text-sm text-gray-500">No cover available</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Cover of ${title || "Book"}`}
      className="w-full h-auto object-cover rounded-lg shadow-lg"
      onError={() => {
        setSrc(null);
        setError(true);
      }}
    />
  );
};

export default BookDetail;
