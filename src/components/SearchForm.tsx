import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string, minPrice?: number, maxPrice?: number) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError(null);
    
    // Validate search term
    if (!query.trim()) {
      setError('Please enter a product name');
      return;
    }
    
    // Parse price values
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
    
    // Validate price range
    if (minPriceNum !== undefined && maxPriceNum !== undefined && minPriceNum > maxPriceNum) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }
    
    // Execute search
    onSearch(query, minPriceNum, maxPriceNum);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Product</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-3">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-1" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mt-4">
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;