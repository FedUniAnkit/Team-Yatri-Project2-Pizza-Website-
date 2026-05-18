const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createReview, getProductReviews, getMyReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', authenticate, createReview);
router.get('/my', authenticate, getMyReviews);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
