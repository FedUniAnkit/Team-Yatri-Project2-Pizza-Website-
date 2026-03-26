import api from './api';

const customizationService = {
  getAllOptions: async () => {
    const response = await api.get('/products/customization-options');
    return response.data;
  },

  getOptionsByType: async (optionType) => {
    const response = await api.get(`/products/customization-options?optionType=${optionType}`);
    return response.data;
  },

  createOption: async (optionData) => {
    const response = await api.post('/products/customization-options', optionData);
    return response.data;
  },

  updateOption: async (id, optionData) => {
    const response = await api.put(`/products/customization-options/${id}`, optionData);
    return response.data;
  },

  deleteOption: async (id) => {
    const response = await api.delete(`/products/customization-options/${id}`);
    return response.data;
  }
};

export default customizationService;
