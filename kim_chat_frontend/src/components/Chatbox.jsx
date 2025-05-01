import React, { useState } from "react";

function Chatbox({ messages = [], onSendMessage }) {
    const [newMessage, setNewMessage] = useState("");

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
            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4">
                        <div className="text-sm text-gray-600">{message.sender}</div>
                        <div className="p-2 bg-white rounded shadow">{message.text}</div>
                    </div>
                ))}
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