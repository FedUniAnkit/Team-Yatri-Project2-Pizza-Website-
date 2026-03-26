import api from './api';

const uploadService = {
  uploadImage: async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default uploadService;
