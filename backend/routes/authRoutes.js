const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const {
  register, login, getProfile, updateProfile, forgotPassword, resetPassword,
} = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 6, message: { message: 'Too many login attempts. Please wait a few minutes.' } });
const forgotLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 4, message: { message: 'Too many requests. Please try again later.' } });

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
