const { Op } = require('sequelize');
const PromoBanner = require('../models/PromoBanner');

// @desc    Get all promo banners (Admin only)
// @route   GET /api/promo-banner
// @access  Private/Admin
const getAllBanners = async (req, res) => {
  try {
    const banners = await PromoBanner.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners', error: error.message });
  }
};

// @desc    Get active promo banner (Public)
// @route   GET /api/promo-banner/active
// @access  Public
const getActiveBanner = async (req, res) => {
  try {
    const now = new Date();
    const banner = await PromoBanner.findOne({
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
      }
    });
    
    if (!banner) {
      return res.status(200).json({ success: true, data: null });
    }
    
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active banner', error: error.message });
  }
};

// @desc    Create a new promo banner (Admin only)
// @route   POST /api/promo-banner
// @access  Private/Admin
const createBanner = async (req, res) => {
  const { title, message, promoCode, style, imageUrl, ctaText, ctaLink, isActive, startDate, endDate } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required' });
  }

  try {
    // If this banner is set to active, deactivate all others
    if (isActive) {
      await PromoBanner.update({ isActive: false }, { where: {} });
    }

    const banner = await PromoBanner.create({
      title,
      message,
      promoCode: promoCode || null,
      style: style || 'gradient',
      imageUrl: imageUrl || null,
      ctaText: ctaText || null,
      ctaLink: ctaLink || null,
      isActive: isActive || false,
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create banner', error: error.message });
  }
};

// @desc    Update a promo banner (Admin only)
// @route   PUT /api/promo-banner/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { title, message, promoCode, style, imageUrl, ctaText, ctaLink, isActive, startDate, endDate } = req.body;

  try {
    const banner = await PromoBanner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    // If this banner is being set to active, deactivate all others
    if (isActive && !banner.isActive) {
      await PromoBanner.update({ isActive: false }, { where: { id: { [Op.ne]: id } } });
    }

    await banner.update({
      title: title || banner.title,
      message: message || banner.message,
      promoCode: promoCode !== undefined ? promoCode : banner.promoCode,
      style: style || banner.style,
      imageUrl: imageUrl !== undefined ? imageUrl : banner.imageUrl,
      ctaText: ctaText !== undefined ? ctaText : banner.ctaText,
      ctaLink: ctaLink !== undefined ? ctaLink : banner.ctaLink,
      isActive: isActive !== undefined ? isActive : banner.isActive,
      startDate: startDate !== undefined ? startDate : banner.startDate,
      endDate: endDate !== undefined ? endDate : banner.endDate
    });

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
  }
};

// @desc    Delete a promo banner (Admin only)
// @route   DELETE /api/promo-banner/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await PromoBanner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await banner.destroy();
    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete banner', error: error.message });
  }
};

module.exports = {
  getAllBanners,
  getActiveBanner,
  createBanner,
  updateBanner,
  deleteBanner
};
