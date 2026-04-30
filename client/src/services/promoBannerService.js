import api from './api';

const promoBannerService = {
  // Get all promo banners (Admin only)
  getAllBanners: async () => {
    const response = await api.get('/promo-banner');
    return response.data;
  },

  // Create a new promo banner (Admin only)
  createBanner: async (bannerData) => {
    const response = await api.post('/promo-banner', bannerData);
    return response.data;
  },

  // Update a promo banner (Admin only)
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/promo-banner/${id}`, bannerData);
    return response.data;
  },

  // Delete a promo banner (Admin only)
  deleteBanner: async (id) => {
    const response = await api.delete(`/promo-banner/${id}`);
    return response.data;
  },
};

export default promoBannerService;
