import React, { useState, useEffect, useRef } from "react";
import Table from "./Table";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

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
  const homeButtonRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
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
        const response = await axios.put(`http://localhost:8080/products/${products[editIndex]._id}`, updatedProduct, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const updatedProducts = [...products];
        updatedProducts[editIndex] = response.data.product;
        setProducts(updatedProducts);
        setEditIndex(null);
      } else {
        const response = await axios.post('http://localhost:8080/products', filters, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
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
      await axios.delete(`http://localhost:8080/products/${productId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 py-8">
      <div className="w-full max-w-screen-xl p-4">
        <button
          ref={homeButtonRef}
          onClick={() => navigate('/home')}
          className='relative overflow-hidden border border-black text-white bg-gray-800 px-4 py-2 rounded hover:bg-black'
        >
          <span className='absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-800 hover:from-black hover:to-black'></span>
          <span className='relative z-10'>
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Home
          </span>
        </button>
      </div>

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
  );
};

export default SearchForm;
