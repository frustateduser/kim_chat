import Chats from "../models/Message.js";
import logger from "../utils/logger.js";

/**
 * Fetch all chat interactions of a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchUserInteractions = async (req, res) => {
  try {
    // Fetch userId from the request
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Find the user's chat interactions
    const userChats = await Chats.findOne({ userId }).populate(
      "interactions.interactedUserId",
      "name username userId"
    );

    if (!userChats) {
      return res.status(204).json({
        success: false,
        message: "Chats not found",
      });
    }

    // Return the user's interactions
    const interactions = userChats.interactions ?? [];
    return res.status(200).json({
      success: true,
      message: "Chats found",
      data: { interactions },
    });
  } catch (error) {
    logger.error("Error fetching user interactions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchUserInteractions };
