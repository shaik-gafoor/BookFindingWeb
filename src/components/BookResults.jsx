import { getCoverUrl, formatAuthors } from "../services/openLibraryApi";

const BookResults = ({ books, loading, error, searchInfo }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Searching for books...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
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
          <h3 className="text-lg font-medium mb-2">Search Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-gray-500">
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
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p>Try searching with different keywords or check your spelling.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
        {searchInfo && (
          <p className="text-sm text-gray-600 mt-1">
            Showing {searchInfo.showing} of {searchInfo.total.toLocaleString()}{" "}
            books found
            {searchInfo.total > 20 && " (displaying first 20 results)"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.slice(0, 20).map((book, index) => (
          <BookCard key={`${book.key}-${index}`} book={book} />
        ))}
      </div>

      {books.length > 20 && (
        <div className="mt-6 text-center text-gray-500">
          <p>Showing first 20 results of {books.length} books found</p>
        </div>
      )}
    </div>
  );
};

const BookCard = ({ book }) => {
  const {
    title,
    author_name = [],
    first_publish_year,
    cover_i,
    publisher = [],
    isbn = [],
    edition_count,
    language = [],
  } = book;

  return (
    <div className="book-card border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
      {/* Book Cover */}
      <div className="mb-3">
        <img
          src={
            getCoverUrl(cover_i) ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA4MEg5MFY5MEg2MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPC9zdmc+"
          }
          alt={`Cover of ${title}`}
          className="w-full h-48 object-cover rounded-md bg-gray-200"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE1MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA4MEg5MFY5MEg2MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPC9zdmc+";
          }}
        />
      </div>

      {/* Book Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {title || "Untitled"}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2">
          by {formatAuthors(author_name)}
        </p>

        <div className="space-y-1 text-xs text-gray-500">
          {first_publish_year && <p>Published: {first_publish_year}</p>}

          {publisher.length > 0 && <p>Publisher: {publisher[0]}</p>}

          {edition_count && <p>Editions: {edition_count}</p>}

          {language.length > 0 && (
            <p>Language: {language.slice(0, 2).join(", ")}</p>
          )}
        </div>

        {isbn.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">ISBN: {isbn[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookResults;
