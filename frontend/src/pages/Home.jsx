import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div ref={sidebarRef} className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className='p-4'>
          <button className='w-full text-left p-2 hover:bg-gray-200' onClick={() => navigate('/search')}>
            Search for products
          </button>
          <button className='w-full text-left p-2 hover:bg-gray-200' onClick={() => navigate('/profilePage')}>
            Profile
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center w-full'>
        <div className='flex w-full justify-between items-center bg-gray-100 p-4 shadow-md'>
          <button className='text-2xl' onMouseOver={() => setSidebarVisible(true)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h1 className='text-2xl mb-5'>{loggedInUser}</h1>
          <div className='relative'>
            <button
              onClick={togglePopup}
              className='text-2xl focus:outline-none mr-4'  // Added margin to move the icon to the left
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
            {popupVisible && (
              <div
                ref={popupRef}
                className='absolute right-0 mt-2 w-64 h-32 bg-white border rounded-lg shadow-lg z-50 flex flex-col items-center justify-center'
              >
                <button
                  onClick={handleLogout}
                  className='block w-3/4 text-center px-4 py-2 text-gray-800 hover:bg-gray-200'
                >
                  Logout
                </button>
                {/* Add more buttons here */}
              </div>
            )}
          </div>
        </div>
        
        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;
