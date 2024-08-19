import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
   
    const storedUsername = localStorage.getItem('loggedInUser');
    const storedEmail = localStorage.getItem('userEmail');
    setUsername(storedUsername || '');
    setEmail(storedEmail || '');
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewUsername(username);
  };

  const handleSaveClick = () => {
    setUsername(newUsername);
    localStorage.setItem('loggedInUser', newUsername); 
    setIsEditing(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>Email:</label>
          <p className='text-lg text-gray-900'>{email}</p>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>Username:</label>
          <div className='flex items-center'>
            {isEditing ? (
              <>
                <input
                  type='text'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className='text-lg border border-gray-300 rounded p-2 mr-2 flex-grow'
                />
                <button onClick={handleSaveClick} className='text-gray-500 hover:text-gray-700'>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </>
            ) : (
              <>
                <p className='text-lg text-gray-900 mr-2'>{username}</p>
                <button onClick={handleEditClick} className='text-gray-500 hover:text-gray-700'>
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
