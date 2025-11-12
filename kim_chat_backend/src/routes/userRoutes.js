import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many signup attempts from this IP, please try again later.",
});

// Protected route example
router.get("/profile", limiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Welcome to your profile", data: { userId: req.user.id } });
});

export default router;
