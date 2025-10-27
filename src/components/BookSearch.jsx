import { useState } from "react";

const BookSearch = ({ onSearch, loading }) => {
  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    subject: "",
  });

  const handleChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // At least one field must be filled
    if (!searchParams.title && !searchParams.author && !searchParams.subject) {
      return;
    }

    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      title: "",
      author: "",
      subject: "",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Books</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title Search */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Book Title
            </label>
            <input
              type="text"
              id="title"
              value={searchParams.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Harry Potter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Author Search */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              value={searchParams.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="e.g., J.K. Rowling"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subject Search */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject/Genre
            </label>
            <input
              type="text"
              id="subject"
              value={searchParams.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="e.g., Science Fiction"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={
              loading ||
              (!searchParams.title &&
                !searchParams.author &&
                !searchParams.subject)
            }
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Searching..." : "Search Books"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Search Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Tips:</strong> You can search by title, author, subject, or
          any combination. Use specific terms for better results.
        </p>
      </div>
    </div>
  );
};

export default BookSearch;
