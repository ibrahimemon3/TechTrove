import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faCamera, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import the Axios instance
import Table from './Table';

const SearchForm = () => {
  const [filters, setFilters] = useState({
    category: "",
    productName: "",
    price: "",
    brand: "",
    image: "", 
  });
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products'); // Use the api instance
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        image: reader.result, 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const results = products.filter((product) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        if (key === "price") return product[key] === filters[key];
        return product[key].toLowerCase().includes(filters[key].toLowerCase());
      });
    });
    setSearchResults(results);
  };

  const handleAddProduct = async () => {
    try {
      if (editIndex !== null) {
        const updatedProduct = { ...filters };
        const response = await api.put(`/products/${products[editIndex]._id}`, updatedProduct); // Use the api instance
        const updatedProducts = [...products];
        updatedProducts[editIndex] = response.data.product;
        setProducts(updatedProducts);
        setEditIndex(null);
      } else {
        const response = await api.post('/products', filters); // Use the api instance
        setProducts([...products, response.data.product]);
      }
      setFilters({
        category: "",
        productName: "",
        price: "",
        brand: "",
        image: "", 
      });
    } catch (err) {
      console.error('Error adding/updating product:', err);
    }
  };

  const handleEditProduct = (index) => {
    const productToEdit = products[index];
    setFilters(productToEdit);
    setEditIndex(index);
  };

  const handleDeleteProduct = async (index) => {
    try {
      const productId = products[index]._id;
      await api.delete(`/products/${productId}`); // Use the api instance
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 py-8">
      {/* Centered Home Button */}
      <div className='absolute top-4 left-1/2 transform -translate-x-1/2 mb-8'>
        <button
          onClick={() => navigate('/')}
          className='text-2xl bg-white text-black border border-black p-2 rounded transition-colors'
          style={{ width: '3rem', height: '3rem' }} // Square shape
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      </div>

      {/* Space between Home button and search form */}
      <div className='mt-24 w-full'>
        <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row items-center gap-4 bg-gray-800 p-12 rounded-lg shadow-lg w-full max-w-screen-xl">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-4 mb-4 flex-wrap justify-center">
              {["Gaming Gear", "Phones and Tablets", "Accessories", "Camera", "Gadgets"].map((category) => (
                <label key={category} className="flex items-center text-gray-200">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={filters.productName}
              onChange={handleInputChange}
              className="w-full lg:w-80 mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={filters.price}
              onChange={handleInputChange}
              className="w-full lg:w-80 mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={filters.brand}
              onChange={handleInputChange}
              className="w-full lg:w-80 mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full lg:w-80 mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAddProduct}
              className="w-full lg:w-auto p-2 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
            >
              {editIndex !== null ? 'Update' : 'Add'} Product
            </button>
            <button
              type="submit"
              className="w-full lg:w-auto p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
            >
              Search
            </button>
          </div>
        </form>
        <Table products={searchResults.length > 0 ? searchResults : products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
      </div>
    </div>
  );
};

export default SearchForm;
