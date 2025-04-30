const Chats = require('../models/Message');

const addChat = async (userId,interactedUserId,conversationId ) => {
    await Chats.updateOne(
        { userId:{$eq: userId} },
        {
            $addToSet: {
                interactions: {
                    interactedUserId: {$eq:interactedUserId},
                    conversationId: conversationId,
                },
            },
        },
        { upsert: true } // Create a new document if it doesn't exist
    );
}

module.exports = { addChat };