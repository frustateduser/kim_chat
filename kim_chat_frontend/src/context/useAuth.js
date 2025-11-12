// src/context/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import {
  loginThunk,
  signupThunk,
  verifyOtpThunk,
  refreshTokenThunk,
  logoutAction,
} from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, isAuthenticated } = useSelector((s) => s.auth);

  const userLogin = async (username, password) => {
    return dispatch(loginThunk({ username, password })).unwrap();
  };

  const register = async (userData) => {
    return dispatch(signupThunk(userData)).unwrap();
  };

  const verifyOtp = async (email, otp) => {
    return dispatch(verifyOtpThunk({ email, otp })).unwrap();
  };

  const refreshToken = async () => {
    return dispatch(refreshTokenThunk()).unwrap();
  };

  const userLogout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userLogin,
    register,
    verifyOtp,
    refreshToken,
    userLogout,
  };
};
