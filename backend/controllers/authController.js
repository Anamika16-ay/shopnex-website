const crypto = require('crypto');
const User = require('../models/User');
const { generateUserToken } = require('../utils/generateToken');

// @route POST /api/auth/register
async function register(req, res) {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ fullName, email: email.toLowerCase(), phone, passwordHash });

  res.status(201).json({
    token: generateUserToken(user._id),
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
}

// @route POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
  }

  res.json({
    token: generateUserToken(user._id),
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
}

// @route GET /api/auth/me
async function getProfile(req, res) {
  res.json({ user: req.user });
}

// @route PUT /api/auth/me
async function updateProfile(req, res) {
  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode } = req.body;

  if (!fullName) return res.status(400).json({ message: 'Full name is required.' });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, phone, addressLine1, addressLine2, city, state, postalCode },
    { new: true }
  ).select('-passwordHash');

  res.json({ user, message: 'Profile updated successfully.' });
}

// @route POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });

  // Always respond the same way regardless of whether the user exists (prevents email enumeration)
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    // In production: send email via SES/SMTP with link containing `token`
    console.log(`Password reset token for ${email}: ${token}`);
  }

  res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
}

// @route POST /api/auth/reset-password
async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password || password.length < 8) {
    return res.status(400).json({ message: 'Invalid request or password too short.' });
  }

  const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
  if (!user) {
    return res.status(400).json({ message: 'This password reset link is invalid or has expired.' });
  }

  user.passwordHash = await User.hashPassword(password);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  res.json({ message: 'Your password has been reset successfully.' });
}

module.exports = { register, login, getProfile, updateProfile, forgotPassword, resetPassword };
