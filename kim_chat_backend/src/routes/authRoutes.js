const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  verifyInputs,
  verifyCredentials,
} = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many signup attempts from this IP, please try again later.',
});

router.post('/signup', limiter, verifyInputs, signup);
router.post('/login', limiter, verifyCredentials, login);
router.post('/forgot-password', limiter, forgotPassword);
router.post('/reset-password', limiter, resetPassword);

module.exports = router;
