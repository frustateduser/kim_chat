import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import Chat from '@pages/Chat';
import Navbar from '@components/Navbar';
import Sidebar from '@components/Sidebar';
import { fetchUserChats, fetchConversation } from '@api/chat';
import { fetchUserProfile } from '../api/user';

// Helper function to generate a conversation ID (replicated from backend)
const generateConversationId = async (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort().join('');
  const encoder = new TextEncoder();
  const data = encoder.encode(sortedIds);
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

const Home = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Fetch user's chats on mount
  useEffect(() => {
    fetchUserProfile().then((res) => {
      console.log(res);
      localStorage.setItem('userId', res.data.userId);
    });
    if (user?.id) {
      fetchUserChats(user.id)
        .then((data) => setChats(data.interactions || []))
        .catch((err) => console.error('Failed to fetch user chats:', err));
    }
  }, [user]);

  // 🔹 Handle selecting a chat from sidebar
  const handleSelectChat = useCallback(async (chat) => {
    const fullChat = { ...chat };
    if (chat.conversationId) {
      try {
        const conversation = await fetchConversation(chat.conversationId);
        fullChat.messages = conversation.messages;
      } catch (error) {
        console.error('Failed to fetch conversation history:', error);
        fullChat.messages = [];
      }
    }
    setSelectedChat(fullChat);
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  // 🔹 Handle selecting a user from search bar
  const handleSelectUser = useCallback(
    async (foundUser) => {
      if (!user || !foundUser) return;

      const conversationId = await generateConversationId(
        user._id,
        foundUser.userId || foundUser._id
      );

      const existingChat = chats.find((c) => c.conversationId === conversationId);

      if (existingChat) {
        handleSelectChat(existingChat);
      } else {
        const newChat = {
          conversationId,
          interactedUserId: {
            _id: foundUser.userId || foundUser._id,
            name: foundUser.name,
            username: foundUser.username,
          },
          messages: [],
        };
        setChats((prev) => [newChat, ...prev]);
        setSelectedChat(newChat);
      }

      if (window.innerWidth < 768) setSidebarOpen(false);
    },
    [user, chats, handleSelectChat]
  );

  // 🔹 Memoize Navbar to prevent unnecessary re-renders
  const memoizedNavbar = useMemo(
    () => <Navbar onUserFound={handleSelectUser} />,
    [handleSelectUser]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {memoizedNavbar}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } md:w-64 flex-shrink-0`}
        >
          <Sidebar chats={chats} onSelectChat={handleSelectChat} />
        </div>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 bg-gray-800 text-white"
          >
            {isSidebarOpen ? 'Close Chats' : 'Open Chats'}
          </button>

          {selectedChat ? (
            <Chat key={selectedChat.conversationId} user={user} chat={selectedChat} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
