const express = require('express');
const rateLimit = require('express-rate-limit');
const { adminProtect } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

const { adminLogin } = require('../controllers/adminAuthController');
const {
  createProduct, updateProduct, deleteProduct, adminListProducts,
} = require('../controllers/productController');
const { createCategory } = require('../controllers/categoryController');
const {
  adminListOrders, adminGetOrder, adminUpdateOrderStatus,
} = require('../controllers/orderController');
const {
  getDashboardStats, listCustomers, toggleCustomerStatus, getReports,
} = require('../controllers/adminController');

const router = express.Router();

const adminLoginLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 5, message: { message: 'Too many login attempts. Please wait a few minutes.' } });

// ---- Public admin auth ----
router.post('/auth/login', adminLoginLimiter, adminLogin);

// ---- Everything below requires a valid admin token ----
router.use(adminProtect);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products
router.get('/products', adminListProducts);
router.post('/products', upload.single('thumbnail'), createProduct);
router.put('/products/:id', upload.single('thumbnail'), updateProduct);
router.delete('/products/:id', deleteProduct);

// Categories
router.post('/categories', createCategory);

// Orders
router.get('/orders', adminListOrders);
router.get('/orders/:id', adminGetOrder);
router.put('/orders/:id/status', adminUpdateOrderStatus);

// Customers
router.get('/customers', listCustomers);
router.put('/customers/:id/toggle-status', toggleCustomerStatus);

// Reports
router.get('/reports', getReports);

module.exports = router;
