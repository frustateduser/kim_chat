import React, { useEffect, useState, useRef } from 'react';
import fetchConversations from '@api/fetchConversations';

function Chatbox({ onSendMessage, selectedChat, currentUser }) {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever chatMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch messages whenever selected chat changes
  useEffect(() => {
    const loadConversations = async () => {
      if (selectedChat?.conversationId) {
        setLoading(true);
        try {
          const fetchedMessages = await fetchConversations(selectedChat.conversationId);
          setChatMessages(fetchedMessages || []);
        } catch (error) {
          console.error('Error fetching conversations:', error);
          setChatMessages([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadConversations();
  }, [selectedChat]);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    // Optimistic UI update
    const tempMessage = {
      id: `temp-${Date.now()}`, // temporary ID
      sender: { name: currentUser?.name || 'You' },
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempMessage]);

    // Send message to parent
    onSendMessage(newMessage);

    // Clear input
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent new line
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gray-200 border-b text-lg font-bold">
        {selectedChat?.interactedUserId?.name || 'Unknown User'}
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : chatMessages.length > 0 ? (
          chatMessages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-bold">{message.sender?.name || 'Unknown Sender'}</span>
                <span className="ml-2 text-gray-400 text-xs">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="p-2 bg-white rounded shadow">{message.message}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages available.</p>
        )}
        <div ref={messagesEndRef}></div>
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
        <button onClick={handleSend} className="bg-purple-500 text-white p-2 rounded ml-2">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
