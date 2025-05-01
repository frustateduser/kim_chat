import React from "react";

const Sidebar = ({ chats, onSelectChat }) => {
  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Recent Chats</h2>
      <ul className="space-y-2">
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat) => (
            <li
              key={`${chat.conversationId}-${chat.interactedUserId?._id}`} // Ensure unique key
              className="p-2 bg-white rounded shadow cursor-pointer hover:bg-purple-400"
              onClick={() => onSelectChat(chat)}
            >
              {chat.interactedUserId?.name || "Unknown User"} {/* Display user name */}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No recent chats available.</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;