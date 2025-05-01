import axios from "axios";


const fetchProfile = (token) => {
    axios.get(import.meta.env.VITE_REACT_APP_PROFILE_API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).then((res) => {
        console.log(res)
        localStorage.setItem('userId', res.data.userId); // Store the userId in localStorage
    }).catch((err)=>{
        console.log(err)
    })
}

export {fetchProfile};