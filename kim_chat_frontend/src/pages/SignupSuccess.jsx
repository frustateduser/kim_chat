// src/pages/SignupSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@components/Footer';

const SignupSuccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative">
        <nav className="navbar border border-purple-500 bg-gradient-to-l from-purple-500 to-white p-4 flex items-center justify-between w-full shadow-md z-20">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src="kim.svg" alt="logo" className="w-14 h-14" />
            <h1 className="text-2xl font-bold text-purple-700 hidden sm:block">KIM Chat</h1>
          </div>
        </nav>
      </div>
      <div className="flex flex-col justify-center items-center h-full mt-3 pt-24">
        <div className="bg-gray-900 p-6 rounded-2xl w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">🎉 Account Verified!</h2>
          <p className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 text-center">
            Your email has been successfully verified. You can now log in to Kim Chat.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded mt-2"
          >
            Go to Login
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupSuccess;
