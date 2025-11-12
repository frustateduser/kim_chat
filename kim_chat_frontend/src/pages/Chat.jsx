import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { wsConnect, wsJoinRoom, wsSend } from '@store/middleware/wsMiddleware';

const Chat = ({ user, chat }) => {
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.chat);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chat?.conversationId || !user?._id) return;

    dispatch(wsConnect());
    dispatch(wsJoinRoom(chat.conversationId, user._id));
  }, [chat?.conversationId, user?._id, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      type: 'message',
      conversationId: chat.conversationId,
      userId: user._id,
      message,
      sender: user.name,
      timestamp: new Date().toISOString(),
    };

    dispatch(wsSend(payload));
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">{chat.interactedUserId?.name || 'Chat'}</h2>
      </div>

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
        <div ref={chatEndRef} />
      </div>

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
