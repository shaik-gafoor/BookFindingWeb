import { useState } from "react";
import BookSearch from "./components/BookSearch";
import BookResults from "./components/BookResults";
import { searchBooks } from "./services/openLibraryApi";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchBooks(searchParams);
      setBooks(results.docs || []);
      setSearchInfo({
        total: results.numFound || 0,
        showing: Math.min(results.docs?.length || 0, 20),
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Book Finder
        </h1>

        {/* Search Container */}
        <div className="mb-8">
          <BookSearch onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Container */}
        <div>
          <BookResults
            books={books}
            loading={loading}
            error={error}
            searchInfo={searchInfo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
