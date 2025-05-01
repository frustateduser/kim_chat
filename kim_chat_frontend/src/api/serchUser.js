import axios from "axios";

const searchUser = async (userId, username) => {
    try {
        const response = await axios.post(import.meta.env.VITE_REACT_APP_SEARCH_USER_API_URL, {
            userId: userId,
            username: username,
        });
        console.log(response.data);
        return response.data; // Return the response data
    } catch (error) {
        console.log("Error searching for user:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export default searchUser;