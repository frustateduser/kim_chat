import Chats from "../models/Message.js";
import logger from "../utils/logger.js";

const addChat = async (userId, interactedUserId, conversationId) => {
  try {
    await Chats.updateOne(
      {
        userId: { $eq: userId },
        "interactions.interactedUserId": interactedUserId,
        "interactions.conversationId": { $ne: conversationId },
      }, // Check if conversationId doesn't exist
      {
        $addToSet: {
          interactions: {
            interactedUserId: interactedUserId,
            conversationId: conversationId,
          },
        },
      },
      { upsert: true } // Create a new document if it doesn't exist
    );
  } catch (error) {
    logger.error("Error adding chat interaction:", error);
  }
};

export { addChat };
