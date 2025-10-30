// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { signup } from '@api/auth';
import Footer from '@components/Footer';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData);
      if (data.success) {
        toast.success('Signup successful! Please verify your email.');
        navigate('/verify', { state: { email: formData.email } });
      } else {
        toast.error(data.message || 'Signup failed.');
      }
    } catch (err) {
      toast.error('Error during signup. Try again later.' + err);
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
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded mt-2"
          >
            Sign Up
          </button>
          <p className="text-center text-sm mt-3 text-gray-400">
            Already have an account?{' '}
            <Link to="/" className="text-indigo-400 cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
