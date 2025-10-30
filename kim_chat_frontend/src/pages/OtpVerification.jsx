// src/pages/OtpVerification.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { verifyOtp } from '@api/auth';
import Footer from '@components/Footer';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        toast.success('Email verified successfully!');
        navigate('/signup-success');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Verification failed. Try again.' + err);
    }
  };

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
        <ToastContainer />
        <form onSubmit={handleVerify} className="bg-gray-900 p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">Enter the OTP sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded mt-2"
          >
            Verify
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default OtpVerification;
