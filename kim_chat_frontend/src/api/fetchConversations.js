import axios from "axios";

const fetchConversations = async (conversationId) => {
    try{
        await axios.get(`${import.meta.env.VITE_REACT_APP_FETCH_CONVERSATION_API_URL}${conversationId}`).then((res) => {
            console.log(res);
            return res.data.conversation.messages;
        });
    }catch (error) {
        console.error("Error fetching conversations:", error);
    }
}

export default fetchConversations;