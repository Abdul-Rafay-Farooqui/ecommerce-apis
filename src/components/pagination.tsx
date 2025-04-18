// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // Maximum number of visible page buttons
  
  const getPageNumbers = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);
    
    // Adjust if we're at the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
      >
        Previous
      </button>
      
      <div className="hidden md:flex space-x-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;