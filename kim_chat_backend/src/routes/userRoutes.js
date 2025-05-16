const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many signup attempts from this IP, please try again later.',
});

// Protected route example
router.get('/profile', limiter, authMiddleware, (req, res) => {
  res.json({ message: 'Welcome to your profile', userId: req.user.id });
});

module.exports = router;
