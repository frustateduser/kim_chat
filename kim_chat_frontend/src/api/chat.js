// src/api/chat.js
import axiosInstance from '@api/axiosInstance';

export const fetchUserChats = async (userId) => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_FETCH_CHATS}${userId}/interactions`
  );
  return res.data;
};

export const fetchConversation = async (conversationId) => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_FETCH_CONVERSATION}${conversationId}`
  );
  return res.data;
};

export const searchUser = async (userId, username) => {
  const res = await axiosInstance.post(import.meta.env.VITE_API_SEARCH_USER, {
    username,
    userId,
  });
  return res.data;
};
