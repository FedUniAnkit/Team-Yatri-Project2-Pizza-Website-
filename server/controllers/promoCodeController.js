const { Promotion } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all promo codes
// @route   GET /api/promo-codes
// @access  Private/Admin
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await Promotion.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: promoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch promo codes.', error: error.message });
  }
};

// @desc    Get active promo codes
// @route   GET /api/promo-codes/active
// @access  Public
const getActivePromoCodes = async (req, res) => {
  try {
    const now = new Date();
    const promoCodes = await Promotion.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { startDate: null },
          { startDate: { [Op.lte]: now } }
        ],
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: now } }
        ]
      },
      attributes: ['code', 'description', 'discountType', 'amount', 'minimumOrderAmount'],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ success: true, data: promoCodes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active promo codes.', error: error.message });
  }
};

// @desc    Create a new promo code
// @route   POST /api/promo-codes
// @access  Private/Admin
const createPromoCode = async (req, res) => {
  const { code, description, discountType, amount, startDate, endDate, usageLimit, minimumOrderAmount, maxDiscountAmount } = req.body;

  if (!code || !discountType || !amount) {
    return res.status(400).json({ success: false, message: 'Code, discount type, and amount are required.' });
  }

  try {
    const promoCode = await Promotion.create({
      code: code.toUpperCase(),
      description,
      discountType,
      amount,
      startDate: startDate || null,
      endDate: endDate || null,
      usageLimit: usageLimit || null,
      minimumOrderAmount: minimumOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      isActive: true,
    });

    res.status(201).json({ success: true, data: promoCode, message: 'Promo code created successfully!' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'This promo code already exists.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Failed to create promo code.', error: error.message });
  }
};

// @desc    Update a promo code
// @route   PUT /api/promo-codes/:id
// @access  Private/Admin
const updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const { code, description, discountType, amount, startDate, endDate, isActive, usageLimit, minimumOrderAmount, maxDiscountAmount } = req.body;

  try {
    const promoCode = await Promotion.findByPk(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }

    await promoCode.update({
      code: code ? code.toUpperCase() : promoCode.code,
      description: description !== undefined ? description : promoCode.description,
      discountType: discountType || promoCode.discountType,
      amount: amount !== undefined ? amount : promoCode.amount,
      startDate: startDate !== undefined ? startDate : promoCode.startDate,
      endDate: endDate !== undefined ? endDate : promoCode.endDate,
      isActive: isActive !== undefined ? isActive : promoCode.isActive,
      usageLimit: usageLimit !== undefined ? usageLimit : promoCode.usageLimit,
      minimumOrderAmount: minimumOrderAmount !== undefined ? minimumOrderAmount : promoCode.minimumOrderAmount,
      maxDiscountAmount: maxDiscountAmount !== undefined ? maxDiscountAmount : promoCode.maxDiscountAmount,
    });

    res.status(200).json({ success: true, data: promoCode, message: 'Promo code updated successfully!' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'This promo code already exists.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    res.status(500).json({ success: false, message: 'Failed to update promo code.', error: error.message });
  }
};

// @desc    Delete a promo code
// @route   DELETE /api/promo-codes/:id
// @access  Private/Admin
const deletePromoCode = async (req, res) => {
  const { id } = req.params;

  try {
    const promoCode = await Promotion.findByPk(id);
    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Promo code not found.' });
    }

    await promoCode.destroy();
    res.status(200).json({ success: true, message: 'Promo code deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete promo code.', error: error.message });
  }
};

// @desc    Validate and apply a promo code
// @route   POST /api/promo-codes/validate
// @access  Public
const validatePromoCode = async (req, res) => {
  const { code, orderAmount } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Promo code is required.' });
  }

  try {
    const promoCode = await Promotion.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      return res.status(404).json({ success: false, message: 'Invalid promo code.' });
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      return res.status(400).json({ success: false, message: 'This promo code is no longer active.' });
    }

    // Check date validity
    const now = new Date();
    if (promoCode.startDate && new Date(promoCode.startDate) > now) {
      return res.status(400).json({ success: false, message: 'This promo code is not yet valid.' });
    }
    if (promoCode.endDate && new Date(promoCode.endDate) < now) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return res.status(400).json({ success: false, message: 'This promo code has reached its usage limit.' });
    }

    // Check minimum order amount
    if (orderAmount && parseFloat(orderAmount) < parseFloat(promoCode.minimumOrderAmount)) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount of $${promoCode.minimumOrderAmount} required to use this promo code.` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
      discountAmount = (parseFloat(orderAmount) * parseFloat(promoCode.amount)) / 100;
      // Apply max discount cap if set
      if (promoCode.maxDiscountAmount && discountAmount > parseFloat(promoCode.maxDiscountAmount)) {
        discountAmount = parseFloat(promoCode.maxDiscountAmount);
      }
    } else {
      discountAmount = parseFloat(promoCode.amount);
    }

    // Ensure discount doesn't exceed order amount
    if (discountAmount > parseFloat(orderAmount)) {
      discountAmount = parseFloat(orderAmount);
    }

    res.status(200).json({ 
      success: true, 
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        amount: promoCode.amount,
        discountAmount: discountAmount.toFixed(2),
        description: promoCode.description,
      },
      message: 'Promo code is valid!' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to validate promo code.', error: error.message });
  }
};

module.exports = {
  getAllPromoCodes,
  getActivePromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
};
