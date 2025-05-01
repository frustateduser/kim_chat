import React, { useState, useEffect } from "react";
import { fetchProfile } from '../api/chatApi';
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";
import Chatbox from "../components/Chatbox";


function Chat() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        if (!token) {
            Error("No token found. Please log in.");
            return;
        }

        fetchProfile(token)

    }, []);

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
                    <SearchBar />
                    <Dropdown />
                </div>

            </header>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar onSelectChat={setSelectedChat} />
                <main className="flex-1 flex flex-col">
                    {selectedChat ? (
                        <Chatbox messages={messages} onSendMessage={handleSendMessage} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Select a chat to start messaging</p>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Chat;