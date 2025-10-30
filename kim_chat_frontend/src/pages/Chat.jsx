import React, { useEffect, useState, useRef } from 'react';
import wsClient from '@utils/websocket';

const Chat = ({ user, chat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chat.messages || []);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chat?.conversationId || !user?._id) return;

    // ✅ Connect and join room
    const setupWebSocket = () => {
      if (wsClient.isConnected()) {
        wsClient.joinRoom(chat.conversationId, user._id);
      } else {
        wsClient.connect();
        wsClient.onOpen(() => {
          wsClient.joinRoom(chat.conversationId, user._id);
        });
      }
    };

    setupWebSocket();

    // ✅ Handle incoming messages
    const handleNewMessage = (data) => {
      if (data.type === 'message' && data.roomId === chat.conversationId) {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'system') {
        console.log('System:', data.message);
      }
    };

    wsClient.onMessage(handleNewMessage);

    // ✅ Cleanup on unmount or chat switch
    return () => {
      wsClient.offMessage(handleNewMessage);
    };
  }, [chat, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      type: 'message',
      roomId: chat.conversationId,
      userId: user._id,
      message,
      sender: user.name,
      timestamp: new Date().toISOString(),
    };

    wsClient.send(payload); // actual send
    setMessages((prev) => [...prev, payload]); // optimistic update
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{chat.interactedUserId?.name || 'Chat'}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-3 rounded-lg max-w-lg text-white ${
              msg.userId === user._id ? 'bg-purple-600 ml-auto' : 'bg-gray-700 mr-auto'
            }`}
          >
            <p className="text-sm font-semibold">
              {msg.sender || (msg.userId === user._id ? user.name : chat.interactedUserId?.name)}
            </p>
            <p className="text-base break-words">{msg.message}</p>
            <p className="text-xs text-gray-400 mt-1 text-right">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-r-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
