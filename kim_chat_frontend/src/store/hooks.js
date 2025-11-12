// src/store/hooks.js
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as authActions from './slices/authSlice';
import * as chatActions from './slices/chatSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Optionally make bound action creators (not required)
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(authActions, dispatch);
};
export const useChatActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(chatActions, dispatch);
};
