import Users from '../models/User.js';
import Conversations from '../models/ChatRoom.js';
import { generateConversationId } from '../utils/uniqueConversationId.js';
import { createConversation } from '../utils/createConversation.js';
import { addChat } from '../utils/addChat.js';

const searchUser = async (req, res) => {
    try {
        const username = req.body.username;
        const userId = req.body.userId;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        let recipient = await Users.findOne({ username: username });
        if (!recipient) {
            return res.status(204).json({ message: 'User not found. Enter correct username.' });
        }

        let conversationId = generateConversationId(userId, recipient._id);

        let conversation = await Conversations.findOne({ conversationId: conversationId });
        if (!conversation) {
            createConversation(conversationId);
        }

        try {
            await addChat(userId, recipient._id, conversationId);
            await addChat(recipient._id, userId, conversationId);
        } catch (error) {
            if (error.code === 11000) {
                console.log("Duplicate conversationId detected. Skipping insertion.");
            } else {
                throw error;
            }
        }

        res.status(200).json({
            message: 'User found and conversation updated/created successfully.',
            conversationId: conversationId,
            recipient: {
                name: recipient.name,
                username: recipient.username,
                userId: recipient._id,
            },
        });
    } catch (error) {
        console.error('Error searching for user:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

export { searchUser };