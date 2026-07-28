const express = require('express');
const { protect } = require('../middleware/auth');
const { submitReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, submitReview);

module.exports = router;
