import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import SearchBar from '@components/SearchBar';

function Navbar({ onUserFound }) {
  const { userLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    userLogout();
    navigate('/login');
  };

  // 🔹 When a user is found via search
  const handleUserFound = (foundUser) => {
    if (foundUser) {
      onUserFound(foundUser); // ✅ send to Home
      setShowMobileSearch(false);
    }
  };

  return (
    <div className="relative">
      <nav className="border border-purple-500 bg-gradient-to-l from-purple-500 to-white p-4 flex items-center justify-between w-full shadow-md z-20">
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img src="kim.svg" alt="logo" className="w-14 h-14" />
          <h1 className="text-2xl font-bold text-purple-700 hidden sm:block">KIM Chat</h1>
        </div>

        <div className="flex-1 mx-4 max-w-2xs hidden md:block">
          <SearchBar onUserFound={handleUserFound} />
        </div>

        <div className="flex items-center space-x-3 relative">
          <button
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="md:hidden bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-md focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-44 w-44 bg-gradient-to-bl from-purple-500 to-white text-purple-700 rounded-md shadow-lg overflow-hidden z-10 font-bold font-sans border-2 border-purple-500">
              <ul>
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-purple-200"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-4 py-2 hover:bg-purple-200"
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-purple-200 text-red-600"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {showMobileSearch && (
        <div className="top-[72px] w-full bg-gradient-to-l from-purple-500 to-white rounded-mdshadow-md border border-purple-300 p-3 md:hidden z-10">
          <SearchBar onUserFound={handleUserFound} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
