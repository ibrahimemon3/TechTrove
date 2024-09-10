import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer

function Payment() {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Show success toast
    toast.success('Thank you for shopping with us', {
      position: 'top-right',
      autoClose: 3000, // Auto close after 3 seconds
    });

    // Navigate to the home page after the toast appears
    setTimeout(() => {
      navigate('/home');
    }, 3000); // 3 seconds to match the toast duration
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 font-audiowide">Payment</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-center text-gray-400 mb-6">Select a payment method:</p>

        <div className="flex justify-center gap-8">
          {/* Payment Button 1 - Bkash */}
          <button
            onClick={handlePayment}
            className="bg-white py-4 px-8 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            <img
              src="/bkash.png"
              alt="Bkash Payment"
              className="w-48 h-24 object-contain"
            />
          </button>

          {/* Payment Button 2 - Rocket */}
          <button
            onClick={handlePayment}
            className="bg-white py-4 px-8 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            <img
              src="/rocket.jpg"
              alt="Rocket Payment"
              className="w-48 h-24 object-contain"
            />
          </button>

          {/* Payment Button 3 - Nagad */}
          <button
            onClick={handlePayment}
            className="bg-white py-4 px-8 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            <img
              src="/nagad.jpg"
              alt="Nagad Payment"
              className="w-48 h-24 object-contain"
            />
          </button>
        </div>
      </div>

      {/* ToastContainer to display toast messages */}
      <ToastContainer />
    </div>
  );
}

export default Payment;
