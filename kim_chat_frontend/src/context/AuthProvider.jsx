// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from '@context/AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // 🟢 Login function — saves userId and token
  const login = (userId, token) => {
    setUserId(userId);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
  };

  // 🔴 Logout function — clears everything
  const logout = () => {
    setUserId(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  };

  // 🟣 Auto restore from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
