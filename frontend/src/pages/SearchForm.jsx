import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Table from "./Table";

const SearchForm = () => {
  const storedAdmin = localStorage.getItem("loggedinUserAdmin");
  const [admin, setAdmin] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    productName: "",
    price: "",
    brand: "",
    image: "",
    description: "", // New field for description
  });
  const [products, setProducts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (storedAdmin === "true") {
      setAdmin(true);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
      setSearchResults(response.data); // Initialize search results with all products
    } catch (err) {
      console.error("Error fetching products:", err);
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
        if (key === "price") {
          // Handle price comparison (convert to string for comparison)
          return product[key] === Number(filters[key]);
        }
        return product[key]
          .toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      });
    });
    setSearchResults(results);
  };

  const handleAddProduct = async () => {
    try {
      if (editIndex !== null) {
        const updatedProduct = { ...filters };
        const response = await api.put(
          `/products/${products[editIndex]._id}`,
          updatedProduct
        );
        const updatedProducts = [...products];
        updatedProducts[editIndex] = response.data.product;
        setProducts(updatedProducts);
        setEditIndex(null);
      } else {
        const response = await api.post("/products", filters);
        setProducts([...products, response.data.product]);
      }
      resetFilters();
    } catch (err) {
      console.error("Error adding/updating product:", err);
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
      await api.delete(`/products/${productId}`);
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      setSearchResults(updatedProducts); // Update the search results after deletion
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      productName: "",
      price: "",
      brand: "",
      image: "",
      description: "", // Reset description
    });
    setSearchResults(products); // Reset search results to all products
  };

  const handleReset = () => {
    resetFilters();
    fetchProducts();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 py-8">
      {/* Centered Home Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-2xl bg-white text-black border border-black p-2 rounded transition-colors"
          style={{ width: "3rem", height: "3rem" }}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      </div>

      <div className="mt-24 w-full max-w-screen-xl">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col lg:flex-row items-center gap-4 bg-gray-800 p-12 rounded-lg shadow-lg w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-4 mb-4 flex-wrap justify-center">
              {["Gaming Gear", "Phones and Tablets", "Accessories", "Camera", "Gadgets"].map(
                (category) => (
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
                )
              )}
            </div>
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={filters.productName}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={filters.price}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={filters.brand}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
            />

            {/* Conditional rendering for admin fields */}
            {admin && (
              <>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full mb-2 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200"
                />
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={filters.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400"
                />
              </>
            )}
          </div>
          <div className="flex flex-col w-full lg:w-auto">
            <button
              type="submit"
              className="bg-gray-200 text-gray-900 px-4 py-2 mb-2 rounded transition-colors hover:bg-gray-400"
            >
              Search
            </button>
            {admin && (
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-green-500 text-gray-200 px-4 py-2 rounded transition-colors hover:bg-green-600"
              >
                {editIndex !== null ? "Update Product" : "Add Product"}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-gray-200 px-4 py-2 rounded transition-colors hover:bg-red-600"
          >
            Reset
          </button>
        </form>

        {/* Search Results Table */}
        <Table
         products={searchResults} // Use searchResults for displaying
         onEdit={handleEditProduct}
         onDelete={handleDeleteProduct}
         admin={admin}
       />
      </div>
    </div>
  );
};

export default SearchForm;
