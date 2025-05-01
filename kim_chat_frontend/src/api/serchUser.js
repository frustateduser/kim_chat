import axios from "axios";


const searchUser = async (userId, username) => {
    try {
        await axios.post(import.meta.env.VITE_REACT_APP_SEARCH_USER_API_URL, {
            userId: userId,
            username: username
        }).then((res) => {
            console.log(res);
            return res.data;
        });

    } catch (error) {
        console.log("Error searching for user:", error);
    }
}

export default searchUser;