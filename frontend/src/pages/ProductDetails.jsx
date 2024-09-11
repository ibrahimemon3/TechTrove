import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  const [flashedProductId, setFlashedProductId] = useState(null); // Add flashedProductId state for button flash effect
  const [cartCount, setCartCount] = useState(0); // Add cart count state
  const [isAdmin, setIsAdmin] = useState(false); // Add state for admin check

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
    updateCartCount(); // Update the cart count when the page loads
    const loggedInUserAdmin = localStorage.getItem("loggedinUserAdmin");
    setIsAdmin(loggedInUserAdmin === "true"); // Check if the user is admin
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get(`/products/related/${productId}`);
      setRelatedProducts(response.data);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  // Function to update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  };

  // Add to Cart functionality
  const onAddToCart = (product, quantity = 1) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex((item) => item._id === product._id);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Flash the button briefly
    setFlashedProductId(product._id);
    setTimeout(() => setFlashedProductId(null), 150);

    // Update cart count after adding to cart
    updateCartCount();
  };

  const handleBuyNow = () => {
    if (product) {
      onAddToCart(product); // Add the product to the cart with a quantity of 1
      navigate('/cart'); // Navigate to the cart page
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 shadow-lg rounded-lg p-12">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Larger Product Image */}
          <img
            src={product.image}
            alt={product.productName}
            className="w-96 h-96 lg:w-[32rem] lg:h-[32rem] object-cover rounded-lg shadow-lg mb-8 lg:mb-0 lg:mr-16 transition-transform duration-300 hover:scale-105"
          />
          <div className="flex flex-col items-center lg:items-start text-white">
            {/* Larger Product Name */}
            <h1 className="text-6xl font-bold mb-8">{product.productName}</h1>
            {/* Larger Price */}
            <p className="text-4xl text-gray-300 mb-6">${product.price}</p>
            {/* Larger Description */}
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mb-10">
              {product.description}
            </p>
            {!isAdmin && ( // Show buttons only if user is not an admin
              <div className="flex space-x-6">
                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)} // Use onAddToCart function
                  className={`bg-blue-600 py-3 px-8 rounded-full text-white font-semibold hover:bg-blue-700 transition-all ${flashedProductId === product._id ? "bg-green-500" : ""}`}
                >
                  Add to Cart
                </button>
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="bg-green-600 py-3 px-8 rounded-full text-white font-semibold hover:bg-green-700 transition-all"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add a Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-4xl text-white text-center mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/products/${relatedProduct._id}`)}
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.productName}
                  className="w-full h-64 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {relatedProduct.productName}
                </h3>
                <p className="text-gray-400">${relatedProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
