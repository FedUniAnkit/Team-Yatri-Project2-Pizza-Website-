import api from './api';

const contentService = {
  // Get all content blocks
  getAllContent: async () => {
    const response = await api.get('/content');
    return response.data;
  },

  // Get a single content block by its key
  getContentByKey: async (key) => {
    const response = await api.get(`/content/${key}`);
    return response.data;
  },

  // Create a new content block (Admin only)
  createContentBlock: async (contentData) => {
    const response = await api.post('/content', contentData);
    return response.data;
  },

  // Update a content block by its ID (Admin only)
  updateContentBlock: async (id, contentData) => {
    const response = await api.put(`/content/${id}`, contentData);
    return response.data;
  },

  // Delete a content block by its ID (Admin only)
  deleteContentBlock: async (id) => {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },
};

export default contentService;
