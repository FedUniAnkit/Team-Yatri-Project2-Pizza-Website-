const { Review, User, Product } = require('../models');
const { Op } = require('sequelize');

const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required.' });
    }

    const existing = await Review.findOne({
      where: { userId, productId, orderId: orderId || null },
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Review updated.', data: existing });
    }

    const review = await Review.create({ userId, productId, orderId, rating, comment });
    res.status(201).json({ message: 'Review submitted.', data: review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to submit review.' });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      data: reviews,
      averageRating: parseFloat(avg),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'imageUrl'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ data: reviews });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch your reviews.' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await review.destroy();
    res.json({ message: 'Review deleted.' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review.' });
  }
};

module.exports = { createReview, getProductReviews, getMyReviews, deleteReview };
