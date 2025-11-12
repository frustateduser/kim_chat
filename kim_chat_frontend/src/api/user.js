// src/api/user.js
import axiosInstance from '@api/axiosInstance';

export const fetchUserProfile = async () => {
  const res = await axiosInstance.get(import.meta.env.VITE_API_PROFILE);
  return res.data;
};
