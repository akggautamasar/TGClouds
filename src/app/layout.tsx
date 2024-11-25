// src/App.js

import React from 'react';

const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Site Temporarily Unavailable</h1>
        <p className="mt-4 text-gray-600">
          We're sorry, but the site is currently unavailable. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default App;
