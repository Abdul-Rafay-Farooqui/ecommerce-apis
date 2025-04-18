import React from 'react';
import { Product } from '../types/product';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, error }) => {
  // Loading skeleton for products
  const LoadingSkeleton = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="bg-gray-300 h-48 w-full"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );

  if (error) {
    return (
      <div className="w-full py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <LoadingSkeleton />
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={`${product.source}-${product.id}`} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">No products found. Try a different search term or price range.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;