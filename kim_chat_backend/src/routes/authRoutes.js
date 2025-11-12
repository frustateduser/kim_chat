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

// Rate limiter for OTP verification attempts
const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP verifications per windowMs
  message: "Too many OTP verification attempts, please try again later.",
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: "Too many token refresh attempts, please try again later.",
});

router.post("/signup", signupLimiter, validateSignup, signup);
router.post("/verify-otp", verifyOtpLimiter, verifyOtp);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/refresh", refreshLimiter, refreshToken);
router.post("/logout", logout);

export default router;
