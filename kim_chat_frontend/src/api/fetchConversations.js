import axios from "axios";

const fetchConversations = async (conversationId) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_FETCH_CONVERSATION_API_URL}${conversationId}`
        );
        console.log(response);
        return response.data.conversation.messages;
    } catch (error) {
        console.error("Error fetching conversations:", error.message);
        return []; // Return an empty array on error
    }
};

export default fetchConversations;