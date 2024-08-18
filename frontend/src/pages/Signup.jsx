import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError('Enter name,email and password');
    }
    try {
      const url = "https://tech-trove-api.vercel.app/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
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
