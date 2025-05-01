import React, { useState, useEffect } from "react";
import axios from "axios";


const Sidebar = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
 

  // useEffect(() => {
  //   // Fetch recent chats from an API
  //   axios.get("")
  //     .then((response) => {
  //       setChats(response.data);
        
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching chats:", error);
       
  //     });
  // }, []);

  
  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Recent Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="p-2 bg-white rounded shadow cursor-pointer hover:bg-purple-400"
            onClick={() => onSelectChat(chat)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
