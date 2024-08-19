import React from 'react'
import SearchForm from '../SearchForm'
import Table from '../Table'
import { ToastContainer } from 'react-toastify'

const SearchPage = () => {
  return (
    <div>
        <SearchForm />
        <ToastContainer />
    </div>
  )
}

export default SearchPage