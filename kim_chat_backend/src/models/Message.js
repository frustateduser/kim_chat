const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for tracking user interactions and conversations
const ChatSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
        unique: true // Ensure each user has a unique entry
    },
    interactions: [
        {
            interactedUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true,
            },
            conversationId: {
                type: String, // Unique conversation ID
                required: true
            }
        }
    ]
});

// Export the model
module.exports = mongoose.model('Chats', ChatSchema);