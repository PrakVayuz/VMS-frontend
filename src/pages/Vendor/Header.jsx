// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
      <div className="text-2xl font-bold">Vendor Management</div>
      <div className="flex items-center">
        <span className="mr-4">Welcome Prakhar Pandey</span>
        <div className="rounded-full bg-gray-300 w-8 h-8"></div>
      </div>
    </div>
  );
};

export default Header;
