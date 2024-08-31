import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import api from "../api";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Add state to check if user is admin
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);
  const sidebarButtonRef = useRef(null);

  useEffect(() => {
    // Get admin status and user info
    const loggedInUserName = localStorage.getItem("loggedInUserName");
    const loggedInUserAdmin = localStorage.getItem("loggedinUserAdmin");
    
    setLoggedInUser(loggedInUserName);
    setIsAdmin(loggedInUserAdmin === "true"); // Set admin status based on localStorage
    
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
    localStorage.removeItem("loggedinUserAdmin"); // Ensure admin status is removed
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

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full bg-blue-900 shadow-lg z-50 transform ${
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
          <div className="flex items-center flex-grow justify-center">
            <h1 className="text-2xl mb-5 text-white">{loggedInUser}</h1>
          </div>
          <div className="flex items-center">
            {!isAdmin && ( // Conditionally render cart button for non-admin users
              <button
                onClick={() => navigate("/cart")}
                className="text-2xl text-white mr-4" // Adjusted margin-right for the Shopping Cart button
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
            )}
            <div className="relative">
              <button
                onClick={togglePopup}
                className="text-2xl focus:outline-none text-white ml-4" // Adjusted margin-left for the User button
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
              {popupVisible && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-64 h-32 bg-gray-700 border rounded-lg shadow-lg z-50 flex flex-col items-center justify-center"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-3/4 text-center px-4 py-2 text-gray-300 hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  {product.productName}
                </h3>
                <p className="text-gray-400 mb-4">${product.price}</p>
                <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;
