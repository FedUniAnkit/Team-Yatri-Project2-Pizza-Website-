import React, { useState, useEffect, useMemo } from 'react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import PizzaCustomizationModal from '../components/PizzaCustomizationModal';
import './Menu.css';

const QUICK_FILTERS = [
  { key: 'vegetarian', label: 'V',  title: 'Vegetarian',  color: '#4caf50' },
  { key: 'vegan',      label: 'VG', title: 'Vegan',        color: '#8bc34a' },
  { key: 'glutenFree', label: 'GF', title: 'Gluten Free',  color: '#ff9800' },
  { key: 'spicy',      label: '🌶', title: 'Spicy',        color: '#f44336' },
];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'              },
  { value: 'name_asc',   label: 'Name: A-Z'            },
  { value: 'name_desc',  label: 'Name: Z-A'            },
  { value: 'price_asc',  label: 'Price: Low to High'   },
  { value: 'price_desc', label: 'Price: High to Low'   },
  { value: 'popular',    label: 'Most Popular'          },
];

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [customizationModal, setCustomizationModal] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getAllProducts();
        console.log('Menu products loaded:', response.data);
        response.data?.forEach(p => {
          if (p.image) console.log(`Product ${p.name} image:`, p.image);
        });
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load menu. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build categories dynamically from products with counts
  const categories = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      const cat = (p.category || 'other').toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1) + (key.endsWith('s') ? '' : 's'),
        count,
      }));
  }, [products]);

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => (p.category || '').toLowerCase() === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.ingredients?.some(i => i.toLowerCase().includes(q))
      );
    }

    activeQuickFilters.forEach(f => {
      if (f === 'spicy') {
        result = result.filter(p => (p.spiceLevel || 0) > 0);
      } else {
        result = result.filter(p => p.dietaryInfo?.[f]);
      }
    });

    if (maxPrice && !isNaN(maxPrice)) {
      result = result.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    switch (sortBy) {
      case 'name_asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc':  result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price_asc':  result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case 'price_desc': result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      case 'popular':    result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)); break;
      default:           result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, activeQuickFilters, maxPrice, sortBy]);

  const toggleQuickFilter = (key) => {
    setActiveQuickFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveQuickFilters([]);
    setMaxPrice('');
    setSortBy('default');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || activeQuickFilters.length > 0 || maxPrice;

  const getMinPrice = (product) => {
    if (product.sizes?.length > 0) {
      const prices = product.sizes.map(s => parseFloat(s.price)).filter(p => !isNaN(p));
      if (prices.length > 0) return Math.min(...prices);
    }
    return parseFloat(product.price);
  };

  const getMaxSizePrice = (product) => {
    if (product.sizes?.length > 1) {
      const prices = product.sizes.map(s => parseFloat(s.price)).filter(p => !isNaN(p));
      if (prices.length > 0) return Math.max(...prices);
    }
    return null;
  };

  const formatPrice = (product) => {
    const min = getMinPrice(product);
    const max = getMaxSizePrice(product);
    if (max && max !== min) return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
    return `$${min.toFixed(2)}`;
  };

  const isPizza = (product) => (product.category || '').toLowerCase().includes('pizza');

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCustomize = (product) => {
    setCustomizationModal(product);
  };

  const handleCustomizedAddToCart = (customizedProduct) => {
    addToCart(customizedProduct);
    toast.success(`${customizedProduct.name} added to cart!`);
  };

  return (
    <div className="menu-container">
      {/* Header */}
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Freshly made with premium ingredients, delivered hot to your door</p>
      </div>

      <div className="menu-controls">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for pizzas, ingredients, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <FiX />
              </button>
            )}
            <button className="search-btn"><FiSearch /></button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-filters">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Items ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Quick Filters + Price + Sort */}
        <div className="filter-row">
          <div className="quick-filters">
            <span className="filter-label"><FiFilter size={14} /> Quick Filters</span>
            {QUICK_FILTERS.map(f => (
              <button
                key={f.key}
                className={`quick-filter-btn ${activeQuickFilters.includes(f.key) ? 'active' : ''}`}
                onClick={() => toggleQuickFilter(f.key)}
                title={f.title}
                style={{ '--qf-color': f.color }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="filter-price-group">
            <span className="filter-label">Under $</span>
            <input
              type="number"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
              min="0"
            />
          </div>

          <div className="sort-options">
            <label className="filter-label">Sort by:</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count + Clear */}
        <div className="results-bar">
          <span className="results-count">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </span>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              <FiX size={14} /> Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="products-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card skeleton-card">
              <div className="skeleton-image" />
              <div className="product-info">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc short" />
                <div className="skeleton-line skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results-container">
          <p>No items found matching your search.</p>
          <button className="clear-filters-btn" onClick={clearAllFilters}>Clear Filters</button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className={`product-card ${!product.isAvailable ? 'unavailable' : ''}`}>
              <div className="product-image-wrapper">
                {product.isPopular && <span className="badge badge-popular">⭐ Popular</span>}
                {product.isNew && <span className="badge badge-new">🆕 New</span>}
                {!product.isAvailable && <div className="unavailable-overlay">Unavailable</div>}
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                {product.ingredients?.length > 0 && (
                  <p className="product-ingredients">
                    {product.ingredients.slice(0, 4).join(', ')}
                    {product.ingredients.length > 4 ? '...' : ''}
                  </p>
                )}
                <div className="product-footer">
                  <div className="price-block">
                    <span className="price-label">{getMaxSizePrice(product) ? 'Range' : 'Price'}</span>
                    <span className="product-price">{formatPrice(product)}</span>
                  </div>
                  <div className="product-tags">
                    {product.dietaryInfo?.vegetarian && <span className="diet-pill">Veg</span>}
                    {product.dietaryInfo?.vegan && <span className="diet-pill">Vegan</span>}
                    {product.spiceLevel > 0 && <span className="diet-pill spicy">🌶 {product.spiceLevel}</span>}
                  </div>
                </div>
                <div className="product-actions">
                  {isPizza(product) ? (
                    <>
                      <button
                        onClick={() => handleCustomize(product)}
                        className="btn-menu btn-primary"
                        disabled={!product.isAvailable}
                      >
                        Customize
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-menu btn-secondary"
                        disabled={!product.isAvailable}
                      >
                        Quick Add
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-menu btn-primary"
                      disabled={!product.isAvailable}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pizza Customization Modal */}
      {customizationModal && (
        <PizzaCustomizationModal
          product={customizationModal}
          onClose={() => setCustomizationModal(null)}
          onAddToCart={handleCustomizedAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;
