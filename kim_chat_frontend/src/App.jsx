/**
 * @fileoverview Main App component for Kim Chat frontend.
 * Handles routing and global layout (Navbar + pages).
 * @author
 * Koustubh Badshah <www.github.com/frustateduser>
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import OtpVerification from '@pages/OtpVerification';
import SignupSuccess from '@pages/SignupSuccess';
import { AuthProvider } from '@context/AuthContext';
import { useAuth } from '@context/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
          <div className="flex-1 p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<OtpVerification />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
            </Routes>
          </div>
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
