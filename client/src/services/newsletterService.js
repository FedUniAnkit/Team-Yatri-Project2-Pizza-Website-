import api from './api';

const newsletterService = {
  // Get all subscribers (Admin only)
  getAllSubscribers: async () => {
    const response = await api.get('/newsletter/subscribers');
    return response.data;
  },

  // Send a marketing email to all subscribers (Admin only)
  sendMarketingEmail: async (emailData) => {
    const response = await api.post('/newsletter/send-marketing-email', emailData);
    return response.data;
  },

  // Send promotional email to customers/subscribers (Admin only)
  sendPromotionalEmail: async (emailData) => {
    const response = await api.post('/newsletter/send-promotional-email', emailData);
    return response.data;
  },

  // Get accurate recipient counts (Admin only)
  getRecipientCounts: async () => {
    const response = await api.get('/newsletter/recipient-counts');
    return response.data;
  },
};

export default newsletterService;
