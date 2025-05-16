import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  verifyInputs,
  verifyCredentials,
} from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

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

export default router;
