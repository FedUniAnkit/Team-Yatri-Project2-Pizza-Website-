const express = require('express');
const router = express.Router();
const {
  getAllPromoCodes,
  getActivePromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
} = require('../controllers/promoCodeController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/promo-codes
// @desc    Get all promo codes (Admin only)
// @access  Private/Admin
router.get('/', authenticate, authorize('admin'), getAllPromoCodes);

// @route   GET /api/promo-codes/active
// @desc    Get active promo codes
// @access  Public
router.get('/active', getActivePromoCodes);

// @route   POST /api/promo-codes
// @desc    Create a new promo code (Admin only)
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), createPromoCode);

// @route   POST /api/promo-codes/validate
// @desc    Validate a promo code
// @access  Public
router.post('/validate', validatePromoCode);

// @route   PUT /api/promo-codes/:id
// @desc    Update a promo code (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, authorize('admin'), updatePromoCode);

// @route   DELETE /api/promo-codes/:id
// @desc    Delete a promo code (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), deletePromoCode);

module.exports = router;
