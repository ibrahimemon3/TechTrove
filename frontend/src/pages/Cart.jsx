import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();

  // Example cart data; this would come from state or props in a real application
  const cartItems = [
    // This array will be populated with real product data later
  ];

  // Calculate the total based on the cart items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Cart</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 mb-4 bg-gray-700 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-grow mx-4">
                <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                <p className="text-gray-300">Quantity: {item.quantity}</p>
              </div>
              <p className="text-lg font-semibold text-white">${item.price * item.quantity}</p>
            </div>
          ))
        )}

        <div className="mt-6 flex justify-between items-center p-4 bg-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-white">Total:</h2>
          <p className="text-xl font-semibold text-white">${calculateTotal().toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate('/home')}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
