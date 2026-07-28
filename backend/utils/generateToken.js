const jwt = require('jsonwebtoken');

function generateUserToken(userId) {
  return jwt.sign({ id: userId, isAdmin: false }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function generateAdminToken(adminId) {
  return jwt.sign({ id: adminId, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { generateUserToken, generateAdminToken };
