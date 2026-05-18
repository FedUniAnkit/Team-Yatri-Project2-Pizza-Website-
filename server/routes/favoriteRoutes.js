const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { toggleFavorite, getMyFavorites, getFavoriteIds } = require('../controllers/favoriteController');

router.post('/toggle', authenticate, toggleFavorite);
router.get('/my', authenticate, getMyFavorites);
router.get('/ids', authenticate, getFavoriteIds);

module.exports = router;
