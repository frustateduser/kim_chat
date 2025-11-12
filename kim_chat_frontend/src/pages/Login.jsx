import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/useAuth';
import Footer from '@components/Footer';

const Login = () => {
  const { userLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userLogin(form.username, form.password);
    navigate('/');
  };

  return (
    <>
      <div className="relative">
        <nav className="navbar border border-purple-500 bg-gradient-to-l from-purple-500 to-white p-4 flex items-center justify-between w-full shadow-md z-20">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <img src="kim.svg" alt="logo" className="w-14 h-14" />
            <h1 className="text-2xl font-bold text-purple-700 sm:block">KIM Chat</h1>
          </div>
        </nav>
      </div>
      <div className="flex justify-center items-center h-full mt-3 pt-24">
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">Welcome Back!!! 🙋‍♂️</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded mt-2"
          >
            Login
          </button>
          <p className="text-center text-sm mt-3 text-gray-400">
            Don’t have an account?{' '}
            <span onClick={() => navigate('/signup')} className="text-indigo-400 cursor-pointer">
              Signup
            </span>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
