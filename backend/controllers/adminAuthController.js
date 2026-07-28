const Admin = require('../models/Admin');
const { generateAdminToken } = require('../utils/generateToken');

// @route POST /api/admin/auth/login
async function adminLogin(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: (email || '').toLowerCase() });

  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }
  if (admin.status !== 'active') {
    return res.status(403).json({ message: 'This admin account is disabled.' });
  }

  admin.lastLogin = new Date();
  await admin.save();

  res.json({
    token: generateAdminToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
}

module.exports = { adminLogin };
