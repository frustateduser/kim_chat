const Conversations = require('../models/ChatRoom');


const fetchChatHistory = async (req, res) => {
    try {
        // Fetch userId and interactedUserId from the request
        const {conversationId} = req.params;

        if (!conversationId) {
            return res.status(400).json({ message: 'userId, interactedUserId and conversationId are required' });
        }

        // Find the conversation by conversationId
        const conversation = await Conversations.findOne({conversationId: conversationId }).populate('messages.sender', 'name username'); // Populate sender details
        if (!conversation) {
            return res.status(204).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation found', conversation: conversation });
        
    } catch (error) {
        console.error('Error fetching chat history:', error); // Log any errors
        res.status(500).json({ message: 'Internal server error', error: error }); // Return 500 for server errors
    }
};

module.exports = { fetchChatHistory };