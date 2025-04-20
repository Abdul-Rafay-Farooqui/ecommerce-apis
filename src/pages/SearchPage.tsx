import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import { searchAmazonProducts } from '../services/amazonApi';
import { searchWalmartProducts } from '../services/walmartApi';
import { searchIkeaProducts } from '../services/ikeaApi';
import { searchTargetProducts } from '../services/targetApi';
import Pagination from '../components/pagination';

const PRODUCTS_PER_PAGE = 12; // Number of products to show per page

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (query: string, minPrice?: number, maxPrice?: number) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1); // Reset to first page on new search
    
    try {
      // Fetch products from both APIs in parallel
      const [targetProducts,amazonProducts,ikeaProducts] = await Promise.all([
        searchTargetProducts(query, minPrice, maxPrice),
        searchAmazonProducts(query, minPrice, maxPrice),
        // searchWalmartProducts(query, minPrice, maxPrice),
        searchIkeaProducts(query, minPrice, maxPrice),
      ]);
      
      // Combine and shuffle results for fairness
      const combinedProducts = [ ...targetProducts, ...amazonProducts, ...ikeaProducts];
      const shuffledProducts = combinedProducts.sort(() => Math.random() - 0.5);
      
      setProducts(shuffledProducts);
      setTotalPages(Math.ceil(shuffledProducts.length / PRODUCTS_PER_PAGE));
      
      if (combinedProducts.length === 0) {
        setError('No products found matching your criteria.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Get current products for the current page
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Product Comparison</h1>
          <p className="mt-2 opacity-90">Find the best deals across Amazon and Walmart</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} loading={loading} />
        
        {hasSearched && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {loading ? 'Searching...' : `Search Results (${products.length} items found)`}
            </h2>
            <ProductList 
              products={getCurrentProducts()} 
              loading={loading} 
              error={error} 
            />
            
            {products.length > PRODUCTS_PER_PAGE && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Product Comparison Tool. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">
            Powered by Amazon and Walmart via RapidAPI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;