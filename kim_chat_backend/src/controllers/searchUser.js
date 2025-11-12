import Users from "../models/User.js";
import Conversations from "../models/ChatRoom.js";
import { generateConversationId } from "../utils/uniqueConversationId.js";
import { createConversation } from "../utils/createConversation.js";
import { addChat } from "../utils/addChat.js";
import logger from "../utils/logger.js";

const searchUser = async (req, res) => {
  try {
    const username = req.body.username;
    const userId = req.body.userId;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    let recipient = await Users.findOne({ username: username });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let conversationId = generateConversationId(userId, recipient._id);

    let conversation = await Conversations.findOne({ conversationId: conversationId });
    if (!conversation) {
      await createConversation(conversationId);
    }

    try {
      await addChat(userId, recipient._id, conversationId);
      await addChat(recipient._id, userId, conversationId);
    } catch (err) {
      logger.error("%s", err.message);
      if (err.code === 11000) {
        logger.info("Duplicate conversationId detected. Skipping insertion.");
      } else {
        logger.error("Error adding chat:", err);
      }
    }

    res.status(200).json({
      success: true,
      message: "User found and conversation updated/created successfully.",
      data: {
        conversationId: conversationId,
        recipient: {
          name: recipient.name,
          username: recipient.username,
          userId: recipient._id,
        },
      },
    });
  } catch (error) {
    logger.error("Error searching for user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { searchUser };
