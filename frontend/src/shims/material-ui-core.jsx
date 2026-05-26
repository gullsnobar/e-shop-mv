import React from 'react';

export const Button = ({ children, onClick, className = '', ...props }) => (
  <button
    onClick={onClick}
    className={`p-1 rounded hover:bg-gray-100 transition inline-flex items-center justify-center ${className}`}
    {...props}
  >
    {children}
  </button>
);
