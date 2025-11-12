// src/pages/Home.jsx
import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchConversation, setSelectedChat } from '@/store/slices/chatSlice';
import Navbar from '@components/Navbar';
import Sidebar from '@components/Sidebar';
import Chat from '@pages/Chat';
import { wsConnect, wsJoinRoom } from '@/store/middleware/wsMiddleware';
import { useAuth } from '@context/useAuth';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const chats = useSelector((s) => s.chat.chats);
  const selectedChat = useSelector((s) => s.chat.selectedChat);
  const messages = useSelector((s) => s.chat.messages);

  useEffect(() => {
    // connect websocket when Home mounts
    dispatch(wsConnect());
  }, [dispatch]);

  useEffect(() => {
    // initial fetch of profile + chats
    const userId = user?._id || user?.id || localStorage.getItem('userId');
    if (userId) dispatch(fetchChats(userId));
  }, [user, dispatch]);

  // When selectedChat changes, fetch conversation and join room
  useEffect(() => {
    if (selectedChat?.conversationId) {
      dispatch(fetchConversation(selectedChat.conversationId));
      const userId = user?._id || user?.id || localStorage.getItem('userId');
      if (userId) dispatch(wsJoinRoom(selectedChat.conversationId, userId));
    }
  }, [selectedChat, user, dispatch]);

  const handleSelectChat = useCallback(
    (chat) => {
      dispatch(setSelectedChat(chat));
    },
    [dispatch]
  );

  const handleSelectUser = useCallback(
    async (foundUser) => {
      if (!user || !foundUser) return;
      const userId1 = user._id || user.id;
      const userId2 = foundUser.userId || foundUser._id;
      // generate conversationId (same helper as before)
      const sortedIds = [userId1, userId2].sort().join('');
      const encoder = new TextEncoder();
      const data = encoder.encode(sortedIds);
      const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const conversationId = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const existing = chats.find((c) => c.conversationId === conversationId);
      if (existing) {
        dispatch(setSelectedChat(existing));
      } else {
        const newChat = {
          conversationId,
          interactedUserId: {
            _id: foundUser.userId || foundUser._id,
            name: foundUser.name || foundUser.username,
            username: foundUser.username,
          },
          messages: [],
        };
        // prepend locally (we can use action)
        dispatch({ type: 'chat/prependChat', payload: newChat });
        dispatch(setSelectedChat(newChat));
      }
    },
    [user, chats, dispatch]
  );

  const memoizedNavbar = useMemo(
    () => <Navbar onUserFound={handleSelectUser} />,
    [handleSelectUser]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {memoizedNavbar}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 md:block">
          <Sidebar onChatSelect={handleSelectChat} />
        </div>

        <main className="flex-1 flex flex-col">
          {selectedChat ? (
            <Chat
              key={selectedChat.conversationId}
              user={user}
              chat={{ ...selectedChat, messages }}
            />
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
