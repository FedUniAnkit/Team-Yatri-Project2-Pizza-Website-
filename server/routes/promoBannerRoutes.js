const express = require('express');
const router = express.Router();
const {
  getAllBanners,
  getActiveBanner,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/promoBannerController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/promo-banner/active
// @desc    Get active promo banner (Public)
// @access  Public
router.get('/active', getActiveBanner);

// @route   GET /api/promo-banner
// @desc    Get all promo banners (Admin only)
// @access  Private/Admin
router.get('/', authenticate, authorize('admin'), getAllBanners);

// @route   POST /api/promo-banner
// @desc    Create a new promo banner (Admin only)
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), createBanner);

// @route   PUT /api/promo-banner/:id
// @desc    Update a promo banner (Admin only)
// @access  Private/Admin
router.put('/:id', authenticate, authorize('admin'), updateBanner);

// @route   DELETE /api/promo-banner/:id
// @desc    Delete a promo banner (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), deleteBanner);

module.exports = router;
