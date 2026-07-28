const Contact = require('../models/Contact');

// @route POST /api/contact
async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: "Thanks for reaching out! Our team will get back to you within 24 hours." });
}

module.exports = { submitContact };
