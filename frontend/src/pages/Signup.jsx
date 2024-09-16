import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import api from '../api';  // Import the axios instance

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    address: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignupInfo((prevInfo) => ({
        ...prevInfo,
        image: reader.result, // Base64 string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, image, address } = signupInfo;

    if (!name || !email || !password || !image || !address) {
      return handleError('Please fill in all required fields.');
    }

    try {
      const response = await api.post('/auth/signup', signupInfo);
      const { success, message, error } = response.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else if (error) {
        handleError(error.message || 'Signup failed');
      }
    } catch (err) {
      handleError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative'>
      <img 
        src='/logo.png' 
        alt='Logo' 
        className='absolute top-0 left-0 p-4'
        style={{ width: '150px' }} 
      />
      <div className='bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-md'>
        <h1 className='mb-5 text-2xl font-bold text-center text-white'>Signup</h1>
        <form onSubmit={handleSignup} className='flex flex-col gap-6'>
          <div className='flex flex-col'>
            <label htmlFor='name' className='text-lg font-medium text-white'>Name</label>
            <input
              onChange={handleChange}
              type='text'
              name='name'
              placeholder='Enter your name...'
              value={signupInfo.name}
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='email' className='text-lg font-medium text-white'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={signupInfo.email}
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' className='text-lg font-medium text-white'>Password</label>
            <input
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Enter your password...'
              value={signupInfo.password}
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='image' className='text-lg font-medium text-white'>Profile Picture</label>
            <input
              onChange={handleImageChange}
              type='file'
              name='image'
              accept='image/*'
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='address' className='text-lg font-medium text-white'>Address</label>
            <input
              onChange={handleChange}
              type='text'
              name='address'
              placeholder='Enter your address...'
              value={signupInfo.address}
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <button type='submit' className='bg-gradient-to-r from-blue-600 to-black hover:from-black hover:to-blue-600 text-white text-lg p-2 rounded-md cursor-pointer mt-3 transition-all duration-300'>
            Signup
          </button>
          <span className='mt-3 text-center text-white'>
            Already have an account? <Link to="/login" className='text-blue-600 hover:text-blue-400 font-medium transition-all duration-300'>Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
