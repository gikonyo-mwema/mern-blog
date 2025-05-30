import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push('...');
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) pages.push('...');
      if (endPage < totalPages) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        {getPageNumbers().map((number, index) => (
          number === '...' ? (
            <span key={index} className="px-3 py-1">...</span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 rounded border ${
                currentPage === number 
                  ? 'bg-teal-500 text-white border-teal-500' 
                  : 'border-gray-300 hover:bg-gray-50'
              } transition-colors`}
            >
              {number}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </nav>
    </div>
  );
}