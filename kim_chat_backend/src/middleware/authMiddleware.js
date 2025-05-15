import User from '../models/User.js';
import jwt from 'jsonwebtoken';



function isEmpty(value) {
    if (value == null) return true; // Check for null or undefined
    if (typeof value === "object") return Object.keys(value).length === 0;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    return false;
}

let verifyInputs = async (req, res, next) => {

    try {
        let { name, username, email, password } = req.body;
        if (isEmpty(name) || isEmpty(username) || isEmpty(email) || isEmpty(password)) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        username = username.toLowerCase();
        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already in use" });
        }


        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[\w\W ]{8,}$/.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one numeric digit, one special character, and can include spaces."
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};



const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};



const verifyCredentials = async (req, res, next) => {

    try {
        let { username, password } = req.body;
        if (isEmpty(username) || isEmpty(password)) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        username = username.toLowerCase();
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export { verifyInputs, authMiddleware, verifyCredentials };