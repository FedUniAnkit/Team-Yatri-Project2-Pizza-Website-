const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  resetPasswordWithOTP,
  updatePassword,
  updatePasswordForced,
  createStaff
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  console.log('[TEST] Test endpoint hit');
  res.json({ success: true, message: 'Backend is working', timestamp: new Date() });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password-otp
// @desc    Reset password with otp
// @access  Public
router.post('/reset-password-otp', resetPasswordWithOTP);

// @route   PATCH /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.patch('/reset-password/:token', resetPassword);

// @route   PATCH /api/auth/update-password
// @desc    Update current user's password
// @access  Private
router.patch('/update-password', authenticate, updatePassword);

// @route   PATCH /api/auth/update-forced-password
// @desc    Update password when forced (staff first login)
// @access  Private
router.patch('/update-forced-password', authenticate, updatePasswordForced);

// @route   POST /api/auth/create-staff
// @desc    Admin creates staff account with temporary password
// @access  Private/Admin
router.post('/create-staff', (req, res, next) => {
  console.log('[ROUTE] /create-staff endpoint hit');
  console.log('[ROUTE] Headers:', req.headers.authorization ? 'Token present' : 'No token');
  next();
}, authenticate, authorize('admin'), createStaff);

// @route   POST /api/auth/invite-staff
// @desc    Alias for create-staff (Admin invites staff with temporary password)
// @access  Private/Admin
router.post('/invite-staff', authenticate, authorize('admin'), createStaff);

module.exports = router;
