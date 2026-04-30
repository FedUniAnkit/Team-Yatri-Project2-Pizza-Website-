import api from './api';

const promoCodeService = {
  // Get all promo codes (Admin only)
  getAllPromoCodes: async () => {
    const response = await api.get('/promo-codes');
    return response.data;
  },

  // Get active promo codes (Public)
  getActivePromoCodes: async () => {
    const response = await api.get('/promo-codes/active');
    return response.data;
  },

  // Create a new promo code (Admin only)
  createPromoCode: async (promoCodeData) => {
    const response = await api.post('/promo-codes', promoCodeData);
    return response.data;
  },

  // Update a promo code (Admin only)
  updatePromoCode: async (id, promoCodeData) => {
    const response = await api.put(`/promo-codes/${id}`, promoCodeData);
    return response.data;
  },

  // Delete a promo code (Admin only)
  deletePromoCode: async (id) => {
    const response = await api.delete(`/promo-codes/${id}`);
    return response.data;
  },

  // Validate a promo code (Public)
  validatePromoCode: async (code, orderAmount) => {
    const response = await api.post('/promo-codes/validate', { code, orderAmount });
    return response.data;
  },
};

export default promoCodeService;
