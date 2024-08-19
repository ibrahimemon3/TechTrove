import React, { useState, useEffect } from "react";
import Table from "./Table";
import axios from 'axios';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://tech-trove-api.vercel.app/products', {
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
        const response = await axios.put(`https://tech-trove-api.vercel.app/products/${products[editIndex]._id}`, updatedProduct, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const updatedProducts = [...products];
        updatedProducts[editIndex] = response.data.product;
        setProducts(updatedProducts);
        setEditIndex(null);
      } else {
        const response = await axios.post('https://tech-trove-api.vercel.app/products', filters, {
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
      await axios.delete(`https://tech-trove-api.vercel.app/products/${productId}`, {
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
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white py-8">
      <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row items-center gap-4 bg-gray-800 p-12 rounded-lg shadow-lg w-full max-w-screen-xl">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-4 mb-4 flex-wrap justify-center">
            {["Gaming Gear", "Phones and Tablets", "Accessories", "Camera", "Gadgets"].map((category) => (
              <label key={category} className="flex items-center text-gray-400">
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
            className="w-full lg:w-80 mb-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={filters.price}
            onChange={handleInputChange}
            className="w-full lg:w-80 mb-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="w-full lg:w-80 mb-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full lg:w-80 mb-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full lg:w-auto p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
          >
            {editIndex !== null ? 'Update' : 'Add'} Product
          </button>
          <button
            type="submit"
            className="w-full lg:w-auto p-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
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
