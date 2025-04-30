const express = require('express');
const { fetchUserInteractions } = require('../controllers/userController');
const { fetchChatHistory } = require('../controllers/chatController');
const {searchUser} = require('../controllers/searchUser');
const router = express.Router();

// Route to fetch all chat interactions of a user
router.get('/users/:userId/interactions', fetchUserInteractions);
router.get('/history/:conversationId', fetchChatHistory);
router.post('/search', searchUser);


module.exports = router;