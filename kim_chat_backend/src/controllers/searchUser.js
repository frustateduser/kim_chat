const Users = require('../models/User');
const Conversations = require('../models/ChatRoom');
const {generateConversationId} = require('../utils/uniqueConversationId');
const {createConversation} = require('../utils/createConversation'); 
const {addChat} = require('../utils/addChat'); 

const searchUser = async (req, res) => {
    try {
        const username = req.body.username;
        const userId = req.body.userId;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        let recipient = await Users.findOne({ username:{$eq : username} }) // Find the recipient user by username

        if (!recipient) {
            return res.status(204).json({ message: 'User not found enter correct username' });
        }

        let conversationId = generateConversationId(userId, recipient._id); // Generate a unique conversation ID

        let conversation = await Conversations.findOne({ conversationId: conversationId }); // Check if the conversation already exists

        if (!conversation) {
            // Create a new conversation if it doesn't exist
            createConversation(conversationId); // Call the function to create a new conversation
        }

        // Update chat interactions in the Chats schema for the requesting user
        addChat(userId, recipient._id, conversationId); // Call the function to add chat interactions

        // Update chat interactions in the Chats schema for the recipient user
        addChat(recipient._id, userId, conversationId); // Call the function to add chat interactions

        // Respond with success and conversation details
        res.status(200).json({
            message: 'User found and conversation updated/created successfully.',
            conversationId: conversationId,
            recipient: {
                username: recipient.username,
                userId: recipient._id,
            },
        });

    } catch (error) {
        console.error('Error searching for user:', error); // Log any errors
        res.status(500).json({ message: 'Internal server error', error: error }); // Return 500 for server errors
    }
}

module.exports = { searchUser };