// src/api/auth.js
import axiosInstance from '@api/axiosInstance';

export const signup = async (userData) => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_SIGNUP, userData);
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_VERIFY_OTP, { email, otp });
  return res.data;
};

export const login = async (username, password) => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_LOGIN, { username, password });
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_LOGOUT);
  return res.data;
};

export const refreshToken = async () => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_REFRESH_TOKEN);
  return res.data;
};
