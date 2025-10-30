import {
  findUserByUsername,
  findByEmail,
  createUser,
  validatePassword,
} from "../services/authService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { getRedisClient } from "../utils/redisClient.js";

const signup = async (req, res) => {
  let { name, username, email, password } = req.body;

  try {
    name = name.toUpperCase();
    username = username.toLowerCase();
    email = email.toLowerCase();

    const checkUser = await findUserByUsername(username);
    if (checkUser) {
      res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const checkEmail = await findByEmail(email);
    if (checkEmail) {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    const redis = getRedisClient();
    if (!redis) {
      console.warn("Redis not available, falling back to in-memory storage or skipping OTP cache.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const tempUserData = JSON.stringify({ name, username, email, password });
    await redis.set(`signup:${email}`, JSON.stringify({ ...JSON.parse(tempUserData), otp }), {
      EX: 600,
    });

    await sendVerificationEmail(email, username, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
    });
  } catch (err) {
    logger.error("Signup error %s", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  let { username, password } = req.body;

  try {
    username = username.toLowerCase();

    const user = await findUserByUsername(username);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        succcess: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    let safeUser = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    res.status(200).json({
      success: true,
      message: "Login sucess",
      data: { accessToken, user: safeUser },
    });
  } catch (error) {
    logger.error("Login error for username->%s: %s", username, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ success: false, message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ _id: decoded._id });
    res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (err) {
    logger.error("JWT error: %s", err);
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out Successfully" });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const redis = getRedisClient();

  try {
    const data = await redis.get(`signup:${email}`);
    if (!data) {
      logger.error("failed to retrive data from redis");
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    const parsed = JSON.parse(data);
    if (parsed.otp !== otp.toString()) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await createUser({
      name: parsed.name,
      username: parsed.username,
      email: parsed.email,
      password: parsed.password,
    });

    await redis.del(`signup:${email}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 604800000,
    });

    let safeUser = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        accessToken,
        user: safeUser,
      },
    });
  } catch (err) {
    logger.error("Error verifying OTP: %s", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { signup, login, refreshToken, logout, verifyOtp };
