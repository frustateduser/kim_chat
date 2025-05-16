const Chats = require('../models/Message');

/**
 * Fetch all chat interactions of a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchUserInteractions = async (req, res) => {
  try {
    // Fetch userId from the request
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find the user's chat interactions
    const userChats = await Chats.findOne({ userId }).populate(
      'interactions.interactedUserId',
      'name username userId'
    );

    if (!userChats) {
      return res
        .status(204)
        .json({ message: 'No chat interactions found for this user' });
    }

    // Return the user's interactions
    res.status(200).json({ interactions: userChats.interactions });
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { fetchUserInteractions };
