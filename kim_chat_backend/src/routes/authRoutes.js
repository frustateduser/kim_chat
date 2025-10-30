import express from "express";
import { signup, login, refreshToken, logout, verifyOtp } from "../controllers/authController.js";
import { validateLogin, validateSignup } from "../middleware/validateInputs.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many signup attempts, please try again later.",
});

router.post("/signup", signupLimiter, validateSignup, signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
