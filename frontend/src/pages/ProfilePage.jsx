import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import 'typeface-audiowide'; // Import Audiowide font

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [address, setAddress] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('loggedInUserName');
    const storedEmail = localStorage.getItem('loggedInUserEmail');
    const storedImage = localStorage.getItem('loggedinUserImage');
    const storedAddress = localStorage.getItem('loggedinUserAddress');
    setUsername(storedUsername || '');
    setEmail(storedEmail || '');
    setImage(storedImage || '');
    setAddress(storedAddress || '');
  }, []);

  const handleEditUsernameClick = () => {
    setIsEditingUsername(true);
    setNewUsername(username);
  };

  const handleEditEmailClick = () => {
    setIsEditingEmail(true);
    setNewEmail(email);
  };

  const handleEditAddressClick = () => {
    setIsEditingAddress(true);
    setNewAddress(address);
  };

  const handleSaveUsernameClick = () => {
    setUsername(newUsername);
    localStorage.setItem('loggedInUserName', newUsername);
    setIsEditingUsername(false);
  };

  const handleSaveEmailClick = () => {
    setEmail(newEmail);
    localStorage.setItem('loggedInUserEmail', newEmail);
    setIsEditingEmail(false);
  };

  const handleSaveAddressClick = () => {
    setAddress(newAddress);
    localStorage.setItem('loggedinUserAddress', newAddress);
    setIsEditingAddress(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setImage(base64Image);
      localStorage.setItem('loggedinUserImage', base64Image);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white'>
      
      {/* Circular Logo Image in Top Left */}
      <div className='absolute top-4 left-4'>
        <button onClick={() => navigate('/')}>
          <img
            src='/logo.png' // Replace with the correct path to your logo
            alt='Logo'
            className='w-12 h-12 rounded-full'
          />
        </button>
      </div>

      {/* "Your Profile" Text - Position Adjusted */}
      <div className="mb-4">
        <h2 className="text-3xl font-audiowide text-white">Your Profile</h2>
      </div>

      <div className='bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-2xl'>
        {/* Username with Edit Button */}
        <div className='flex items-center justify-between mb-6'>
          {isEditingUsername ? (
            <>
              <input
                type='text'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className='text-4xl font-extrabold border border-gray-700 rounded p-2 mr-2 bg-teal-100 text-black flex-grow text-center'
              />
              <button
                onClick={handleSaveUsernameClick}
                className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </>
          ) : (
            <>
              <h1 className='text-5xl font-extrabold text-black mr-4'>{username}</h1>
              <button
                onClick={handleEditUsernameClick}
                className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          )}
        </div>

        {/* Centered Profile Picture with Camera Icon */}
        <div className='mb-6 flex flex-col items-center relative mx-auto' style={{ width: '8rem', height: '8rem' }}>
          <div
            className='relative w-full h-full rounded-full overflow-hidden'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {image && (
              <img
                src={image}
                alt='User Profile'
                className='w-full h-full object-cover rounded-full'
              />
            )}
            {isHovered && (
              <label 
                htmlFor='upload-image'
                className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer'
              >
                <FontAwesomeIcon icon={faCamera} className='text-white text-2xl' />
              </label>
            )}
          </div>
          <input
            type='file'
            id='upload-image'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
        </div>

        {/* Email with Label and Edit Button */}
        <div className='mb-6'>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-black mr-2'>Email:</span>
            {isEditingEmail ? (
              <>
                <input
                  type='text'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className='text-2xl border border-gray-700 rounded p-2 mr-2 flex-grow bg-teal-100 text-black'
                />
                <button
                  onClick={handleSaveEmailClick}
                  className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
                >
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-2xl text-black mr-2'>{email}</p>
                <button
                  onClick={handleEditEmailClick}
                  className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Address with Label and Edit Button */}
        <div className='mb-6'>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-black mr-2'>Address:</span>
            {isEditingAddress ? (
              <>
                <input
                  type='text'
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className='text-2xl border border-gray-700 rounded p-2 mr-2 flex-grow bg-teal-100 text-black'
                />
                <button
                  onClick={handleSaveAddressClick}
                  className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
                >
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-2xl text-black mr-2'>{address}</p>
                <button
                  onClick={handleEditAddressClick}
                  className='text-white bg-black hover:bg-gray-800 p-2 rounded transition-colors'
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
