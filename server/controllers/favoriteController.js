const { Favorite, Product } = require('../models');

const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const existing = await Favorite.findOne({ where: { userId, productId } });

    if (existing) {
      await existing.destroy();
      return res.json({ message: 'Removed from favorites.', favorited: false });
    }

    await Favorite.create({ userId, productId });
    res.status(201).json({ message: 'Added to favorites.', favorited: true });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Failed to toggle favorite.' });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'product' }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ data: favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Failed to fetch favorites.' });
  }
};

const getFavoriteIds = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      attributes: ['productId'],
    });
    res.json({ data: favorites.map(f => f.productId) });
  } catch (error) {
    console.error('Get favorite IDs error:', error);
    res.status(500).json({ message: 'Failed to fetch favorite IDs.' });
  }
};

module.exports = { toggleFavorite, getMyFavorites, getFavoriteIds };
