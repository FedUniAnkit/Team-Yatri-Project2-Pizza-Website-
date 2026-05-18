import api from './api';

const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getMyReviews: () => api.get('/reviews/my'),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
