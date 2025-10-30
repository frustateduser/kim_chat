import express from "express";
import { fetchUserInteractions } from "../controllers/userController.js";
import { fetchChatHistory } from "../controllers/chatController.js";
import { searchUser } from "../controllers/searchUser.js";
const router = express.Router();
import RateLimit from "express-rate-limit";

// Rate limiting middleware to prevent abuse
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Route to fetch all chat interactions of a user
router.get("/users/:userId/interactions", limiter, fetchUserInteractions);
router.get("/history/:conversationId", limiter, fetchChatHistory);
router.post("/search", limiter, searchUser);

export default router;
