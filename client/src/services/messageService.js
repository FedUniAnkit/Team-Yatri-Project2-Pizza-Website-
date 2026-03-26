import api from './api';

const messageService = {
  // Get all messages for a specific order
  getMessages: async (orderId) => {
    try {
      const response = await api.get(`/messages/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a new message for a specific order
  sendMessage: async (orderId, messageData) => {
    try {
      const response = await api.post(`/messages/${orderId}`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export default messageService;
