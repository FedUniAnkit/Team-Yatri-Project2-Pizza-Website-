import api from './api';

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get the logged-in user's order history
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Get a specific order by its ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get all orders (for admin/staff)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Update an order's status (for admin/staff)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Cancel an order (for customers)
  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Cancel an order by staff with reason (S3-9)
  cancelOrderByStaff: async (orderId, reason) => {
    const response = await api.put(`/orders/${orderId}/staff-cancel`, { reason });
    return response.data;
  },

  // Initiate order modification
  initiateOrderModification: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/modify`);
    return response.data;
  },
};

export default orderService;
