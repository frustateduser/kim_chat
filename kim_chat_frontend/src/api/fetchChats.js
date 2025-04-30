import axios from "axios";

const fetchChats = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get userId from localStorage
      if (!userId) {
        console.error("User ID not found in localStorage");
        return [];
      }

      // Fetch recent chats from the API
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_FETCH_CHATS_API_URL}${userId}/interactions`
      );

      // Set chats to the interactions array
      return response.data.interactions;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return []; // Return an empty array in case of error
    }
  };

  export default fetchChats;