import React, { useState, useEffect } from "react";
import { fetchProfile } from "../api/chatApi";
import Sidebar from "../components/Sidebar";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Chatbox from "../components/Chatbox";
import fetchChats from "../api/fetchChats";

function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    fetchProfile(token);

    const loadChats = async () => {
      try {
        const chats = await fetchChats(); // Fetch recent chats from the API
        setRecentChats(chats || []); // Ensure chats is an array
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }

    loadChats();
  }, []);

  const handleUserFound = (userData) => {
    if (!userData) {
      console.error("User data is undefined");
      return;
    }

    const { conversationId, recipient } = userData;

    // Add the user to recent chats
    setRecentChats((prevChats) => {
      // Avoid duplicate entries
      const existingChat = prevChats?.find(
        (chat) => chat.conversationId === conversationId
      );
      if (existingChat) return prevChats;

      return [
        ...prevChats,
        { interactedUserId: recipient, conversationId },
      ];
    });

    // Open the chat in the chatbox
    setSelectedChat({ interactedUserId: recipient, conversationId });
  };

  const handleSendMessage = (text) => {
    const newMessage = { sender: "User", text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-row bg-gradient-to-l from-purple-500 to-white-100 text-white p-4 justify-between">
        <div className="flex items-center space-x-4">
          <img src="/kim.svg" alt="KIM Logo" className="h-15 w-15" />
          <h1 className="text-xl text-purple-700">KIM Chat</h1>
        </div>
        <div className="flex items-center space-x-4 gap-4">
          <SearchBar onUserFound={handleUserFound} />
          <Dropdown />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar chats={recentChats} onSelectChat={setSelectedChat} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <Chatbox
              messages={messages}
              onSendMessage={handleSendMessage}
              selectedChat={selectedChat}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Chat;