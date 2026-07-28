const express = require('express');
const { protect } = require('../middleware/auth');
const { placeOrder, getMyOrders, getOrderByNumber } = require('../controllers/orderController');

const router = express.Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;
