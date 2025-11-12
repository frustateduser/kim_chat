// src/components/Sidebar.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setSelectedChat } from '@/store/slices/chatSlice';

const Sidebar = ({ onChatSelect }) => {
  const dispatch = useDispatch();
  const chats = useSelector((s) => s.chat.chats);
  const loading = useSelector((s) => s.chat.loading);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    const userId = user?.id || user?._id || localStorage.getItem('userId') || null;
    if (userId) {
      dispatch(fetchChats(userId));
    }
  }, [user, dispatch]);

  const handleSelect = (chat) => {
    dispatch(setSelectedChat(chat));
    if (onChatSelect) onChatSelect(chat);
  };

  return (
    <div className="flex flex-col w-full max-w-sm border-r border-gray-300 dark:border-gray-700">
      <div className="p-4 font-bold">Chats</div>
      <div className="flex-1 overflow-auto">
        {loading ? (
          <p className="p-4 text-gray-500">Loading chats...</p>
        ) : chats.length === 0 ? (
          <p className="p-4 text-gray-500">No chats yet</p>
        ) : (
          chats.map((c) => (
            <div
              key={c.conversationId}
              className="p-3 border-b hover:bg-gray-800 cursor-pointer"
              onClick={() => handleSelect(c)}
            >
              <div className="text-sm font-semibold">
                {c.interactedUserId?.name || c.interactedUserId?.username}
              </div>
              <div className="text-xs text-gray-400">{c.lastMessage || c.preview || ''}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
