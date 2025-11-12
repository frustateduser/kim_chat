import Conversations from "../models/ChatRoom.js";
import logger from "../utils/logger.js";

const fetchChatHistory = async (req, res) => {
  try {
    // Fetch userId and interactedUserId from the request
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "ConversationId is required",
      });
    }

    // Find the conversation by conversationId
    const conversation = await Conversations.findOne({ conversationId: conversationId }).populate(
      "messages.sender",
      "name username"
    ); // Populate sender details
    if (!conversation) {
      res.status(204).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Conversation found", data: { conversation: conversation } });
  } catch (error) {
    logger.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { fetchChatHistory };
