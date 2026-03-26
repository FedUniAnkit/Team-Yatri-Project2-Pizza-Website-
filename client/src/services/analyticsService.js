import api from './api';

const analyticsService = {
  // Get sales analytics data
  getSalesAnalytics: async (period = 'monthly') => {
    try {
      const response = await api.get(`/analytics/sales?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  },

  // Get product analytics data
  getProductAnalytics: async (limit = 10, period = 'month') => {
    try {
      const response = await api.get(`/analytics/products?limit=${limit}&period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  },

  // Get dashboard summary statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default analyticsService;
