import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import api from "../api";
import 'typeface-audiowide';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [flashedProductId, setFlashedProductId] = useState(null);
  const [profileImage, setProfileImage] = useState(''); // For the profile image
  
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);
  const sidebarButtonRef = useRef(null);

  useEffect(() => {
    const loggedInUserName = localStorage.getItem("loggedInUserName");
    const loggedInUserAdmin = localStorage.getItem("loggedinUserAdmin");
    const storedImage = localStorage.getItem("loggedinUserImage"); // Fetch profile image from localStorage

    setLoggedInUser(loggedInUserName);
    setIsAdmin(loggedInUserAdmin === "true");
    setProfileImage(storedImage); // Set profile image state

    updateCartCount();

    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarButtonRef.current &&
        !sidebarButtonRef.current.contains(event.target)
      ) {
        setSidebarVisible(false);
      }
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedinUserAdmin");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible((prevState) => !prevState);
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(count);
  };

  const onAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex((item) => item._id === product._id);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    setFlashedProductId(product._id);
    setTimeout(() => setFlashedProductId(null), 150);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-navy-900 to-black shadow-lg z-50 transform ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
        onMouseEnter={() => setSidebarVisible(true)}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <div className="p-4">
          <button
            className="w-full text-left p-2 hover:bg-black text-white transition-colors mb-4"
            onClick={() => navigate("/search")}
          >
            Search for products
          </button>
          <button
            className="w-full text-left p-2 hover:bg-black text-white transition-colors"
            onClick={() => navigate("/profilePage")}
          >
            Profile
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex w-full justify-between items-center bg-gray-800 p-4 shadow-md">
          <button
            ref={sidebarButtonRef}
            className="text-3xl text-white"
            onClick={handleSidebarToggle}
            onMouseEnter={() => setSidebarVisible(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Tech Trove Logo in Audiowide Font with Right Margin Adjustment */}
          <h1 className="text-4xl font-audiowide text-white ml-8">Tech Trove</h1>

          <div className="flex items-center">
            {!isAdmin && (
              <button
                onClick={() => navigate("/cart")}
                className="text-2xl text-white mr-4 relative"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <div className="relative flex items-center">
              {/* Profile Image Button */}
              <button
                onClick={togglePopup}
                className="focus:outline-none ml-4"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">?</span>
                  </div>
                )}
              </button>

              {popupVisible && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 p-4"
                  style={{ top: "3rem" }}
                >
                  <div className="flex flex-col items-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full mb-2"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400 mb-2" />
                    )}
                    <span className="text-white text-lg mb-2">{loggedInUser}</span>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6 p-4">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/products/${product._id}`)}
              className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full mx-auto transform hover:scale-105 transition-transform duration-300 cursor-pointer relative"
              style={{ height: '24rem' }}
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-400 mb-4">${product.price}</p>
              </div>
              {!isAdmin && ( // Show the "Add to Cart" button only for non-admin users
                <div className="p-4 text-center absolute bottom-0 w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${
                      flashedProductId === product._id ? "flash-animation" : ""
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
