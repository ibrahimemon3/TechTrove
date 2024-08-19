import React from 'react'
import SearchForm from '../SearchForm'
import { ToastContainer } from 'react-toastify'

const SearchPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
        <SearchForm />
        <ToastContainer />
    </div>
  )
}

export default SearchPage
