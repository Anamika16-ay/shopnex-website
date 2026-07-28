const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function adminProtect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized as admin.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) return res.status(401).json({ message: 'Admin not found.' });
    if (admin.status !== 'active') return res.status(403).json({ message: 'Admin account disabled.' });

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired admin token.' });
  }
}

module.exports = { adminProtect };
