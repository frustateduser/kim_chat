import Conversations from "../models/ChatRoom.js"; // Import the Conversations model

const createConversation = async (conversationId) => {
  let conversation = new Conversations({
    conversationId: conversationId,
    messages: [], // Initialize with an empty messages array
  });
  await conversation.save();
};

export { createConversation };
