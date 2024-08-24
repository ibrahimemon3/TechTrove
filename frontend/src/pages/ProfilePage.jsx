import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

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
  const [newImage, setNewImage] = useState('');

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
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl'>
        <h1 className='text-2xl font-bold mb-6 text-center'>User Profile</h1>

        {/* Display User Image */}
        <div className='mb-6 flex flex-col items-center'>
          {image && (
            <img
              src={image}
              alt='User Profile'
              className='w-32 h-32 rounded-full mb-4 object-cover'
            />
          )}
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='text-gray-400 text-sm'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2'>Email:</label>
          <div className='flex items-center'>
            {isEditingEmail ? (
              <>
                <input
                  type='text'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className='text-lg border border-gray-600 rounded p-2 mr-2 flex-grow bg-gray-700 text-white'
                />
                <button onClick={handleSaveEmailClick} className='text-gray-400 hover:text-gray-200'>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-lg text-gray-300 mr-2'>{email}</p>
                <button onClick={handleEditEmailClick} className='text-gray-400 hover:text-gray-200'>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2'>Username:</label>
          <div className='flex items-center'>
            {isEditingUsername ? (
              <>
                <input
                  type='text'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className='text-lg border border-gray-600 rounded p-2 mr-2 flex-grow bg-gray-700 text-white'
                />
                <button onClick={handleSaveUsernameClick} className='text-gray-400 hover:text-gray-200'>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-lg text-gray-300 mr-2'>{username}</p>
                <button onClick={handleEditUsernameClick} className='text-gray-400 hover:text-gray-200'>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2'>Address:</label>
          <div className='flex items-center'>
            {isEditingAddress ? (
              <>
                <input
                  type='text'
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className='text-lg border border-gray-600 rounded p-2 mr-2 flex-grow bg-gray-700 text-white'
                />
                <button onClick={handleSaveAddressClick} className='text-gray-400 hover:text-gray-200'>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-lg text-gray-300 mr-2'>{address}</p>
                <button onClick={handleEditAddressClick} className='text-gray-400 hover:text-gray-200'>
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
