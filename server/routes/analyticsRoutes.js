const express = require('express');
const { getSalesAnalytics, getProductAnalytics, getProductTrends, getDashboardStats } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(authenticate);
router.use(authorize('admin'));

// Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// Get sales analytics data
router.get('/sales', getSalesAnalytics);

// Get product analytics data
router.get('/products', getProductAnalytics);

// Get product trend movers/decliners
router.get('/product-trends', getProductTrends);

module.exports = router;
