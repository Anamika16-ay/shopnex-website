const express = require('express');
const { protect } = require('../middleware/auth');
const { getCart, addToCart, updateCartItem } = require('../controllers/cartController');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);

module.exports = router;
