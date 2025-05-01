const Chats = require('../models/Message');

const addChat = async (userId, interactedUserId, conversationId) => {
    try {
        await Chats.updateOne(
            { 
                userId: userId,
                "interactions.conversationId": { $ne: conversationId } }, // Check if conversationId doesn't exist
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
        console.error("Error adding chat interaction:", error);
        throw error;
    }
};

module.exports = { addChat };