import React, { useState, useEffect } from 'react';
import { fetchUserChats } from '@api/chat';

const Sidebar = ({ onChatSelect }) => {
  const [chats, setChats] = useState([]);

 

  useEffect(() => {
    // Load user’s chat list
    const loadChats = async () => {
      const data = await fetchUserChats(localStorage.getItem('userId'));
      setChats(data);
    };
    loadChats();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-sm border-r border-gray-300 dark:border-gray-700">
      
    </div>
  );
};

export default Sidebar;
