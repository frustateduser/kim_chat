const express = require('express');
const { fetchUserInteractions } = require('../controllers/userController');
const { fetchChatHistory } = require('../controllers/chatController');
const {searchUser} = require('../controllers/searchUser');
const router = express.Router();
const RateLimit = require('express-rate-limit');

// Rate limiting middleware to prevent abuse
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// Route to fetch all chat interactions of a user
router.get('/users/:userId/interactions',limiter, fetchUserInteractions);
router.get('/history/:conversationId',limiter, fetchChatHistory);
router.post('/search',limiter, searchUser);


module.exports = router;