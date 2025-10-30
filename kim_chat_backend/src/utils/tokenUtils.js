// utils/token.js
import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRY,
    algorithm: process.env.JWT_ALGO,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRY,
    algorithm: process.env.JWT_ALGO,
  });
};
