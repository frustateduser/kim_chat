/**
 * @fileoverview Auth Context for Kim Chat.
 * Handles user authentication, token persistence, and auto-login.
 * Integrates with REST API endpoints (/api/auth/login, /api/auth/register).
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { login, logout } from '@api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.log('failed to parse user data from localStorage', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const userLogin = async (username, password) => {
    try {
      const res = await login(username, password);
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
      setUser(res.data.user);
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      toast.success('Account created! Please log in.', res);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const userLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    toast('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, userLogin, register, userLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
