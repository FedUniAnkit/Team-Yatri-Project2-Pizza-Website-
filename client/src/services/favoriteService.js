import api from './api';

const favoriteService = {
  toggleFavorite: (productId) => api.post('/favorites/toggle', { productId }),
  getMyFavorites: () => api.get('/favorites/my'),
  getFavoriteIds: () => api.get('/favorites/ids'),
};

export default favoriteService;
