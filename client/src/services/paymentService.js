import api from './api';

const paymentService = {
  createPaymentIntent: async (amount, orderId = null) => {
    const response = await api.post('/payment/create-payment-intent', {
      amount,
      orderId
    });
    return response.data;
  },

  confirmPayment: async (paymentIntentId, orderId) => {
    const response = await api.post('/payment/confirm-payment', {
      paymentIntentId,
      orderId
    });
    return response.data;
  }
};

export default paymentService;
