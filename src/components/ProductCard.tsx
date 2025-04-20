import React from 'react';
import { Product } from '../types/product';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleClick = () => {
    window.open(product.url, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate color based on source
  const getBadgeColor = () => {
    return product.source === 'amazon' 
      ? 'bg-orange-500 text-white' 
      : product.source === 'ikea'
      ? 'bg-yellow-500 text-white'
      : product.source === 'target'
      ? 'bg-red-500 text-white'
      : 'bg-gray-500 text-white';
  };

  // Truncate title if too long
  const truncateTitle = (title: string, maxLength = 60) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-gray-200"
    >
      <div className="relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={product.title}
          className="w-full h-48 object-contain bg-gray-50 p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${getBadgeColor()}`}>
          {product.source.toUpperCase()}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2 h-6 overflow-hidden">
          {truncateTitle(product.title)}
        </h3>
        
        {product.rating && (
          <div className="flex items-center mb-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        )}
        
        <p className="text-xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;