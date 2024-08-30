import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import api from '../api'; // Import the axios instance

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Enter email and password');
    }

    try {
      const response = await api.post('/auth/login', loginInfo);
      const { success, message, accessToken, refreshToken, user } = response.data;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('loggedInUserEmail', user.email);
        localStorage.setItem('loggedInUserName', user.name);
        localStorage.setItem('loggedinUserImage', user.image);
        localStorage.setItem('loggedinUserAddress', user.address);
        localStorage.setItem('loggedinUserAdmin', user.admin);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative'>
      <img 
        src='/logo.png' 
        alt='Logo' 
        className='absolute top-0 left-0 p-4'
        style={{ width: '300px' }} 
      />
      <div className='bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-md'>
        <h1 className='mb-5 text-2xl font-bold text-center text-white'>Login</h1>
        <form onSubmit={handleLogin} className='flex flex-col gap-6'>
          <div className='flex flex-col'>
            <label htmlFor='email' className='text-lg font-medium text-white'>Email</label>
            <input
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={loginInfo.email}
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
              value={loginInfo.password}
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50'
            />
          </div>
          <button type='submit' className='bg-gradient-to-r from-blue-600 to-black hover:from-black hover:to-blue-600 text-white text-lg p-2 rounded-md cursor-pointer mt-3 transition-all duration-300'>
            Login
          </button>
          <span className='mt-3 text-center text-white'>
            Don't have an account? <Link to="/signup" className='text-blue-600 hover:text-blue-400 font-medium transition-all duration-300'>Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
