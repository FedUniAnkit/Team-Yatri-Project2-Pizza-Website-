import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import favoriteService from '../../services/favoriteService';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import './MyFavorites.css';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/200x200?text=🍕';
    if (imagePath.startsWith('http')) return imagePath;
    const base = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
    return `${base}${imagePath}`;
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await favoriteService.getMyFavorites();
        setFavorites(res.data.data || []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    try {
      await favoriteService.toggleFavorite(productId);
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      toast.info('Removed from favorites.');
    } catch {
      toast.error('Failed to remove favorite.');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div className="fav-loading">Loading your favorites...</div>;

  return (
    <div className="fav-container">
      <div className="fav-header">
        <h1>My Favorites</h1>
        <p>Your saved pizzas and dishes</p>
      </div>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">❤️</div>
          <h2>No favorites yet</h2>
          <p>Browse the menu and tap the heart icon to save your favorite items.</p>
          <Link to="/menu" className="fav-btn-menu">Browse Menu</Link>
        </div>
      ) : (
        <div className="fav-grid">
          {favorites.map(fav => {
            const product = fav.product;
            if (!product) return null;
            return (
              <div key={fav.id} className="fav-card">
                <div className="fav-card-image">
                  <button
                    className="fav-remove-btn"
                    onClick={() => handleRemoveFavorite(product.id)}
                    title="Remove from favorites"
                  >
                    <FaHeart />
                  </button>
                  {product.image ? (
                    <img src={getImageUrl(product.image)} alt={product.name} />
                  ) : (
                    <div className="fav-no-image">🍕</div>
                  )}
                </div>
                <div className="fav-card-info">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p className="fav-desc">{product.description}</p>
                  )}
                  <div className="fav-card-footer">
                    <span className="fav-price">${parseFloat(product.price).toFixed(2)}</span>
                    <button
                      className="fav-add-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isAvailable}
                    >
                      {product.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
