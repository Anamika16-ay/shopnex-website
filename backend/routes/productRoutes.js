const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { listProducts, getProductBySlug, getHomeSections } = require('../controllers/productController');

const router = express.Router();

router.get('/home/sections', getHomeSections);
router.get('/', listProducts);
router.get('/:slug', optionalAuth, getProductBySlug);

module.exports = router;
