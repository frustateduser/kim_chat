import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access Denied. No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
