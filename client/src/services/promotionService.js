import api from './api';

const promotionService = {
  // Get all promotions
  getAllPromotions: async () => {
    const response = await api.get('/promotions');
    return response.data;
  },

  // Get a single promotion by ID
  getPromotionById: async (id) => {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  // Create a new promotion (Admin only)
  createPromotion: async (promotionData) => {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  },

  // Update a promotion (Admin only)
  updatePromotion: async (id, promotionData) => {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  // Delete a promotion (Admin only)
  deletePromotion: async (id) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },
};

export default promotionService;
