import Conversations from "../models/ChatRoom.js";
import logger from "../utils/logger.js";

const addMessages = async (conversationId, senderId, message) => {
  try {
    const conversation = await Conversations.findOne({ conversationId: conversationId });
    if (!conversation) {
      return null;
    }
    conversation.messages.push({
      sender: senderId,
      message: message,
      timestamp: new Date(),
    });
    await conversation.save();
    return conversation;
  } catch (error) {
    logger.error("Error adding message to conversation:", error);
  }
};

export default addMessages;
