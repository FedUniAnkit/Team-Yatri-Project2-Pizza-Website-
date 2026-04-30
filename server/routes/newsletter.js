const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  sendMarketingEmail,
  sendPromotionalEmailToCustomers,
  getRecipientCounts,
} = require('../controllers/newsletterController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to the newsletter
// @access  Public
router.post('/subscribe', subscribe);

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private/Admin
router.get('/subscribers', authenticate, authorize('admin'), getAllSubscribers);

// @route   GET /api/newsletter/recipient-counts
// @desc    Get accurate recipient counts for promotional emails
// @access  Private/Admin
router.get('/recipient-counts', authenticate, authorize('admin'), getRecipientCounts);

// @route   POST /api/newsletter/send-marketing-email
// @desc    Send a marketing email to all subscribers (Admin only)
// @access  Private/Admin
router.post('/send-marketing-email', authenticate, authorize('admin'), sendMarketingEmail);

// @route   POST /api/newsletter/send-promotional-email
// @desc    Send promotional email to customers/subscribers (Admin only)
// @access  Private/Admin
router.post('/send-promotional-email', authenticate, authorize('admin'), sendPromotionalEmailToCustomers);

module.exports = router;
