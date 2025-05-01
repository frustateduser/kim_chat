import React, { useEffect, useState } from "react";
import fetchConversations from "../api/fetchConversations";

function Chatbox({ messages = [], onSendMessage, selectedChat }) {
    const [newMessage, setNewMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const loadConversations= async () => {
            if(selectedChat?.conversationId){
                try{
                    const fetchedMessages = await fetchConversations(selectedChat.conversationId);
                    setChatMessages(fetchedMessages || []); // Set the fetched messages in state
                } catch (error) {
                    console.error("Error fetching conversations:", error);
                    setChatMessages([]); 
                }
            }
        };
        loadConversations(); 
    },[selectedChat]);

    const handleSend = () => {
        if (newMessage.trim() === "") return;
        onSendMessage(newMessage);
        setNewMessage(""); // Clear the input field after sending
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 bg-gray-200 border-b text-lg font-bold">
                {selectedChat?.interactedUserId?.name || "Unknown User"} {/* Display user name */}
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {Array.isArray(chatMessages) && chatMessages.length > 0 ? (
                    chatMessages.map((message, index) => (
                        <div key={index} className="mb-4">
                            <div className="text-sm text-gray-600">{message.sender}</div>
                            <div className="p-2 bg-white rounded shadow">{message.text}</div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No messages available.</p>
                )}
            </div>

            {/* Input Section */}
            <div className="p-4 bg-gray-100 border-t flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={handleSend}
                    className="bg-purple-500 text-white p-2 rounded ml-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatbox;