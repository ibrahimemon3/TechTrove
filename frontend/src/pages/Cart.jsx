import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [flashing, setFlashing] = useState({ id: null, type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.price * quantity;
    }, 0);
  };

  const handleQuantityChange = (id, amount, type) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = (item.quantity || 1) + amount;
        if (newQuantity <= 0) return null; // Remove the item if quantity is 0 or less
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item !== null); // Remove any null items

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Flash the button
    setFlashing({ id, type });
    setTimeout(() => setFlashing({ id: null, type: '' }), 150); // Flash for 150ms
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // Inline styles for flashing effect
  const getFlashingStyle = (itemId, buttonType) => {
    return flashing.id === itemId && flashing.type === buttonType
      ? { animation: 'flash-black 0.15s ease' }
      : {};
  };

  const handleProceedToCheckout = () => {
    handleClearCart(); // Clear the cart
    navigate('/payment'); // Navigate to payment page
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 font-audiowide">Your Cart</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center p-4 mb-6 bg-black rounded-lg shadow-md border border-gray-600"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-grow mx-6">
                <h2 className="text-xl font-semibold text-white">{item.productName}</h2>
                <div className="flex items-center mt-2">
                  <p className="text-gray-300 text-sm">Quantity:</p>
                  <button
                    onClick={() => handleQuantityChange(item._id, -1, 'minus')}
                    style={getFlashingStyle(item._id, 'minus')}
                    className="bg-white text-black py-1 px-3 rounded mx-2 font-bold"
                  >
                    -
                  </button>
                  <span className="text-gray-300 text-sm">{item.quantity || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1, 'plus')}
                    style={getFlashingStyle(item._id, 'plus')}
                    className="bg-white text-black py-1 px-3 rounded mx-2 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center mx-4">
                <p className="text-lg font-semibold text-white mr-6">
                  ৳{(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="bg-white text-black py-1 px-4 rounded font-bold hover:bg-gray-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        <div className="mt-8 flex justify-between items-center p-4 bg-gray-700 rounded-lg">
          <h2 className="text-2xl font-semibold text-white">Total:</h2>
          <p className="text-2xl font-semibold text-white">৳{calculateTotal().toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-4">
        <button
          onClick={() => navigate('/home')}
          className="bg-white text-black py-2 px-6 rounded-lg shadow-md font-bold hover:bg-gray-200 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => handleClearCart()}
          className="bg-white text-black py-2 px-6 rounded-lg shadow-md font-bold hover:bg-gray-200 transition-colors"
        >
          Clear Cart
        </button>
        <button
          onClick={() => handleProceedToCheckout()} // Clear cart and proceed to payment
          className="bg-white text-black py-2 px-6 rounded-lg shadow-md font-bold hover:bg-gray-200 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Inline CSS for animation */}
      <style>
        {`
          @keyframes flash-black {
            0% {
              background-color: black;
              color: white;
            }
            100% {
              background-color: white;
              color: black;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Cart;
