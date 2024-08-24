import React from 'react';
import SearchForm from '../SearchForm';
import { ToastContainer } from 'react-toastify';

const SearchPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <SearchForm />
      <ToastContainer />
    </div>
  );
};

export default SearchPage;
