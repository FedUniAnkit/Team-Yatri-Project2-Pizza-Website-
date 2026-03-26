const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const emailService = require('../utils/emailService');
const { sequelize } = require('../config/database');

// Generate random token for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash the reset token
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    console.log('[REGISTER] Registration attempt for:', req.body.email);
    console.log('[REGISTER] Request body:', req.body);
    
    const { name, email, password, phone, role } = req.body;

    // Validate Australian phone number (10 digits, starting with 04/02/03/07/08)
    if (phone) {
      const cleanedPhone = phone.replace(/\s+/g, '');
      if (!/^\d{10}$/.test(cleanedPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits'
        });
      }
      if (!/^(04|02|03|07|08)/.test(cleanedPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Must be a valid Australian phone number (starting with 04, 02, 03, 07, or 08)'
        });
      }
    }

    // Validate password strength
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const pwErrors = [];
    if (!/[A-Z]/.test(password)) pwErrors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) pwErrors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) pwErrors.push('one number');
    if (!/[!@#$%^&*()_+\-={}[\]|;:'",.<>?/`~]/.test(password)) pwErrors.push('one special character');
    if (pwErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain: ' + pwErrors.join(', ')
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('[REGISTER] User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create new user
    console.log('[REGISTER] Creating new user with role:', role || 'customer');
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    console.log('[REGISTER] User created:', { id: user.id, email: user.email, role: user.role });

    // Generate token
    console.log('[REGISTER] User ID for token generation:', user.id);
    console.log('[REGISTER] User dataValues:', user.dataValues);
    const token = generateToken(user.id);
    console.log('[REGISTER] Generated token:', token);
    
    // Verify the token we just created
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[REGISTER] Token verification test - decoded:', decoded);
    } catch (tokenError) {
      console.error('[REGISTER] Token verification failed:', tokenError);
    }

    console.log('[REGISTER] Registration successful for:', email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[REGISTER] Registration error:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('[LOGIN] Login attempt for:', req.body.email);
    const { email: rawEmail, password } = req.body;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : rawEmail;

    if (!email || !password) {
      console.log('[LOGIN] Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive', 'forcePasswordReset', 'accountStatus']
    });
    if (!user) {
      console.log('[LOGIN] User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('[LOGIN] User found:', email);
    console.log('[LOGIN] User object:', { id: user.id, email: user.email, role: user.role });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('[LOGIN] Password mismatch for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('[LOGIN] User inactive:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated' 
      });
    }

    // Activate pending staff accounts on first login
    if (user.accountStatus === 'pending_staff_registration') {
      await User.update(
        { accountStatus: 'active' },
        { where: { id: user.id } }
      );
      console.log('[LOGIN] Staff account activated on first login:', email);
    }

    // Generate token
    console.log('[LOGIN] User ID for token generation:', user.id);
    console.log('[LOGIN] User dataValues:', user.dataValues);
    const token = generateToken(user.id);
    console.log('[LOGIN] Generated token:', token);
    
    // Verify the token we just created
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[LOGIN] Token verification test - decoded:', decoded);
    } catch (tokenError) {
      console.error('[LOGIN] Token verification failed:', tokenError);
    }
    
    console.log('[LOGIN] Login successful for:', email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        forcePasswordReset: user.forcePasswordReset
      }
    });
  } catch (error) {
    console.error('[LOGIN] Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.' 
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    console.log('getMe called for user ID:', req.user?.id);
    
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
    });

    if (!user) {
      console.log('User not found in database for ID:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('User found, returning data for:', user.email);
    const response = { 
      success: true, 
      user: user.toJSON()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Forgot password - send OTP (replaces old token-based system)
const forgotPasswordOTP = async (req, res) => {
  try {
    console.log('[FORGOT_PASSWORD] Request for:', req.body.email);
    const { email: rawEmail } = req.body;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : rawEmail;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email - only select necessary fields
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'otpCode', 'otpExpires']
    });
    
    if (!user) {
      console.log('[FORGOT_PASSWORD] User not found:', email);
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, you will receive an OTP shortly.'
      });
    }

    console.log('[FORGOT_PASSWORD] User found:', email);

    // Generate OTP manually to avoid model method issues
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await User.update(
      { 
        otpCode: otp,
        otpExpires: otpExpires
      },
      { where: { id: user.id } }
    );

    console.log('[FORGOT_PASSWORD] OTP generated for:', email);

    // Send OTP email
    try {
      await emailService.sendOTPEmail(user, otp);
      console.log('[FORGOT_PASSWORD] OTP email sent successfully to:', email);
    } catch (emailError) {
      console.error('[FORGOT_PASSWORD] Failed to send OTP email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address. Please check your inbox.'
    });

  } catch (error) {
    console.error('[FORGOT_PASSWORD] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password.'
      });
    }

    // 1) Hash the token from the URL
    const hashedToken = hashResetToken(token);
    
    // 2) Find user by token and check if it's not expired
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired.'
      });
    }

    // 3) Update user's password and clear reset token
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = Date.now();
    user.forcePasswordReset = false;
    
    await user.save();
    
    // 4) Log the user in (send token)
    const authToken = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      token: authToken,
      message: 'Password reset successful!'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password.'
    });
  }
};

// Update password (for logged-in users)
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1) Get user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // 2) Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Your current password is incorrect.'
      });
    }
    
    // 3) Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // 4) Direct SQL update to bypass any hooks
    await sequelize.query(
      'UPDATE "Users" SET password = $1, "passwordChangedAt" = $2, "updatedAt" = $3 WHERE id = $4',
      {
        bind: [hashedPassword, new Date(), new Date(), user.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    // 5) Generate new token
    const token = generateToken(user.id);
    
    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Update password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your password.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Force password reset (for admins)
const forcePasswordReset = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action.'
      });
    }
    
    // Find user and force password reset
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Set force password reset flag
    user.forcePasswordReset = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User will be required to reset their password on next login.'
    });
    
  } catch (error) {
    console.error('Force password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while forcing password reset.'
    });
  }
};

// Check if password reset is required
const checkPasswordReset = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.status(200).json({
      success: true,
      forcePasswordReset: user.forcePasswordReset
    });
    
  } catch (error) {
    console.error('Check password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while checking password reset status.'
    });
  }
};

// Update password when forced
const updateForcedPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user.forcePasswordReset) {
      return res.status(403).json({
        success: false,
        message: 'You are not required to reset your password.',
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    user.forcePasswordReset = false;

    await user.save();

    const token = generateToken(user.id);

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      forcePasswordReset: user.forcePasswordReset,
    };

    res.status(200).json({
      success: true,
      token,
      user: updatedUser,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your password.',
    });
  }
};

// Update password when forced (for staff first login)
const updatePasswordForced = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For forced password reset, we don't need to verify current password
    // since this is for first-time login with temporary password
    
    // Update password and remove force reset flag
    user.password = newPassword;
    user.forcePasswordReset = false;
    user.passwordChangedAt = new Date();
    await user.save();

    // Generate new token
    const token = generateToken(user.id);

    // Return updated user object
    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      forcePasswordReset: false
    };

    res.status(200).json({
      success: true,
      token,
      user: updatedUser,
      message: 'Password updated successfully!'
    });
  } catch (error) {
    console.error('Update forced password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating your password.'
    });
  }
};

// Generate temporary password
const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8);
};


// Verify OTP and reset password
const resetPasswordWithOTP = async (req, res) => {
  try {
    console.log('[RESET_PASSWORD_OTP] Request for:', req.body.email);
    const { email: rawEmail, otp, newPassword } = req.body;
    const email = rawEmail ? rawEmail.toLowerCase().trim() : rawEmail;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('[RESET_PASSWORD_OTP] User not found:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid request'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      console.log('[RESET_PASSWORD_OTP] Invalid or expired OTP for:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    console.log('[RESET_PASSWORD_OTP] OTP verified for:', email);

    // Update password
    user.password = newPassword;
    user.otpCode = null;
    user.otpExpires = null;
    user.passwordChangedAt = new Date();
    await user.save();

    console.log('[RESET_PASSWORD_OTP] Password reset successful for:', email);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('[RESET_PASSWORD_OTP] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.'
    });
  }
};

// Create staff account (admin only)
const createStaff = async (req, res) => {
  try {
    console.log('[ADMIN] Create staff endpoint called');
    console.log('[ADMIN] Request body:', req.body);
    console.log('[ADMIN] User making request:', req.user?.email);
    
    const { name, email, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('[ADMIN] User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    console.log('[ADMIN] Generated temporary password:', temporaryPassword);
    
    // Create new staff user with pending status until they accept the invite
    const newUser = await User.create({
      name,
      email,
      password: temporaryPassword,
      phone,
      address,
      role: 'staff',
      forcePasswordReset: true,
      isTemporaryPassword: true,
      accountStatus: 'pending_staff_registration'
    });

    // Send email invitation
    let emailSent = false;
    try {
      console.log(`[ADMIN] Sending staff invitation email to: ${email}`);
      await emailService.sendStaffInvitationEmail(newUser, temporaryPassword);
      console.log(`✅ Staff invitation email sent successfully to: ${email}`);
      emailSent = true;
    } catch (emailError) {
      console.error('❌ Failed to send invitation email:', emailError);
    }

    console.log(`[ADMIN] Staff account created by admin ${req.user.email} for ${email}`);

    res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Staff account created successfully. Invitation email sent.'
        : 'Staff account created but invitation email failed to send. Please share the temporary password manually.',
      emailSent,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      temporaryPassword: temporaryPassword
    });
  } catch (error) {
    console.error('Create staff account error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create staff account' 
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword: forgotPasswordOTP,
  resetPassword,
  resetPasswordWithOTP,
  updatePassword,
  updatePasswordForced,
  createStaff
};
