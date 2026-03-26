// Last updated: 2026-03-23 03:06 - Fixed ingredients array safety
import React, { useState, useEffect, useRef } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import customizationService from '../../services/customizationService';
import uploadService from '../../services/uploadService';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash } from 'react-icons/fi';
import './AdminProducts.css';

const AdminProducts = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const emptyProduct = {
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: '',
    ingredients: [],
    sizes: [],
    allergens: [],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false
    },
    spiceLevel: 0,
    preparationTime: 15,
    isAvailable: true,
    isPopular: false,
    isNew: false,
    sortOrder: 0
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes, ingredientsRes] = await Promise.all([
        productService.getAllProductsAdmin(),
        categoryService.getAllCategories(),
        customizationService.getAllOptions()
      ]);

      const productList = Array.isArray(productsRes?.data)
        ? productsRes.data
        : Array.isArray(productsRes?.data?.data)
          ? productsRes.data.data
          : [];

      setProducts(productList);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      
      // Keep ingredients grouped by type for organized display
      setIngredients(ingredientsRes.data || {});
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product ? { ...product } : { ...emptyProduct });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const response = await uploadService.uploadImage(file);
      const imageUrl = response?.data?.url || response?.url;
      if (imageUrl) {
        setCurrentProduct(prev => ({ ...prev, image: imageUrl }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Upload succeeded but URL missing.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDietaryChange = (key) => {
    setCurrentProduct(prev => ({
      ...prev,
      dietaryInfo: {
        ...prev.dietaryInfo,
        [key]: !prev.dietaryInfo[key]
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setCurrentProduct(prev => ({ ...prev, [field]: items }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...currentProduct.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setCurrentProduct(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setCurrentProduct(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: '' }]
    }));
  };

  const removeSize = (index) => {
    setCurrentProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...currentProduct,
        price: parseFloat(currentProduct.price),
        spiceLevel: parseInt(currentProduct.spiceLevel),
        preparationTime: parseInt(currentProduct.preparationTime),
        sortOrder: parseInt(currentProduct.sortOrder) || 0
      };

      if (currentProduct.id) {
        await productService.updateProduct(currentProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully!');
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const toggleAvailability = async (product) => {
    try {
      await productService.updateProduct(product.id, {
        ...product,
        isAvailable: !product.isAvailable
      });
      toast.success(`Product ${!product.isAvailable ? 'marked as available' : 'marked as unavailable'}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  return (
    <div className="admin-products-container">
      {/* Main Navigation Tabs */}
      <div className="main-tabs">
        <button
          className={`main-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🍕 Products
        </button>
        <button
          className={`main-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📁 Categories
        </button>
        <button
          className={`main-tab ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          🌿 Ingredients
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <>
          <div className="products-header">
            <h1>Product Management</h1>
            <button onClick={() => handleOpenModal()} className="btn-add-product">
              + Add New Product
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="category-tabs">
        <button
          className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Categories ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name} ({products.filter(p => p.category === cat.name).length})
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className={`product-card-admin ${product.isAvailable ? '' : 'unavailable'}`}>
              <div className="product-image-container">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
                {!product.isAvailable && (
                  <div className="product-unavailable-overlay">Currently Unavailable</div>
                )}
                <div className={`stock-badge ${product.isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                  {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                {product.sizes?.length > 0 && (
                  <p className="product-sizes">
                    {product.sizes.map(s => s.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="product-actions">
                <button
                  onClick={() => toggleAvailability(product)}
                  className={`btn-toggle-stock ${product.isAvailable ? 'btn-disable' : 'btn-enable'}`}
                >
                  {product.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
                <button onClick={() => handleOpenModal(product)} className="btn-edit">
                  <FiEdit /> Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className="btn-delete">
                  <FiTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <h2>{currentProduct?.id ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Basic Info */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={currentProduct.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Prep Time (min)</label>
                      <input
                        type="number"
                        name="preparationTime"
                        value={currentProduct.preparationTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        value={currentProduct.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Subcategory</label>
                      <input
                        type="text"
                        name="subcategory"
                        value={currentProduct.subcategory}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <input
                      type="text"
                      name="image"
                      value={currentProduct.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <div className="upload-row">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn-upload"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >{isUploadingImage ? 'Uploading...' : 'Upload from device'}</button>
                    </div>
                    {currentProduct.image && (
                      <div className="image-preview">
                        <img src={currentProduct.image} alt="Product preview" style={{maxWidth: '200px', marginTop: '0.5rem', borderRadius: '8px'}} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Ingredients & Allergens */}
                <div className="form-section">
                  <h3>Ingredients & Allergens</h3>
                  <div className="form-group">
                    <label>Ingredients (comma-separated)</label>
                    <textarea
                      value={currentProduct.ingredients.join(', ')}
                      onChange={(e) => handleArrayChange('ingredients', e.target.value)}
                      rows="3"
                      placeholder="Tomato, Cheese, Basil"
                    />
                  </div>
                  <div className="form-group">
                    <label>Allergens (comma-separated)</label>
                    <textarea
                      value={currentProduct.allergens.join(', ')}
                      onChange={(e) => handleArrayChange('allergens', e.target.value)}
                      rows="2"
                      placeholder="Dairy, Gluten, Nuts"
                    />
                  </div>
                  <div className="form-group">
                    <label>Spice Level (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      name="spiceLevel"
                      value={currentProduct.spiceLevel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Sizes */}
                <div className="form-section">
                  <h3>Sizes & Pricing</h3>
                  {currentProduct.sizes.map((size, index) => (
                    <div key={index} className="size-row">
                      <input
                        type="text"
                        placeholder="Size name (e.g., Small)"
                        value={size.name}
                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                      />
                      <button type="button" onClick={() => removeSize(index)} className="btn-remove-size">
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSize} className="btn-add-size">
                    + Add Size
                  </button>
                </div>

                {/* Dietary Info & Flags */}
                <div className="form-section">
                  <h3>Dietary Information</h3>
                  <div className="checkbox-group">
                    {Object.keys(currentProduct.dietaryInfo).map(key => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={currentProduct.dietaryInfo[key]}
                          onChange={() => handleDietaryChange(key)}
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                    ))}
                  </div>
                  <h3>Product Flags</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={currentProduct.isAvailable}
                        onChange={handleInputChange}
                      />
                      Available for Sale
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isPopular"
                        checked={currentProduct.isPopular}
                        onChange={handleInputChange}
                      />
                      Mark as Popular
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={currentProduct.isNew}
                        onChange={handleInputChange}
                      />
                      Mark as New
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input
                      type="number"
                      name="sortOrder"
                      value={currentProduct.sortOrder}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  {currentProduct?.id ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}

      {/* Categories Tab Content */}
      {activeTab === 'categories' && (
        <div className="tab-content">
          <div className="products-header">
            <h1>Category Management</h1>
            <button onClick={() => {
              setCurrentCategory({ name: '', displayName: '', description: '', sortOrder: 0 });
              setIsCategoryModalOpen(true);
            }} className="btn-add-product">+ Add New Category</button>
          </div>
          
          {isLoading ? (
            <p className="loading-text">Loading categories...</p>
          ) : (
            <div className="categories-grid">
              {Array.isArray(categories) && categories.map(category => (
                <div key={category.id} className="category-card">
                  <div className="category-info">
                    <h3>{category.displayName}</h3>
                    <p className="category-name">ID: {category.name}</p>
                    <p className="category-desc">{category.description || 'No description'}</p>
                    <p className="category-count">{category.productCount || 0} products</p>
                  </div>
                  <div className="category-actions">
                    <button onClick={() => {
                      setCurrentCategory({...category});
                      setIsCategoryModalOpen(true);
                    }} className="btn-edit">
                      <FiEdit /> Edit
                    </button>
                    <button onClick={async () => {
                      try {
                        await categoryService.deleteCategory(category.id);
                        toast.success('Category deleted!');
                        fetchData();
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Failed to delete');
                      }
                    }} className="btn-delete">
                      <FiTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Modal */}
          {isCategoryModalOpen && (
            <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{currentCategory?.id ? 'Edit Category' : 'Add Category'}</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (currentCategory.id) {
                      await categoryService.updateCategory(currentCategory.id, currentCategory);
                      toast.success('Category updated!');
                    } else {
                      await categoryService.createCategory(currentCategory);
                      toast.success('Category created!');
                    }
                    fetchData();
                    setIsCategoryModalOpen(false);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to save');
                  }
                }}>
                  <div className="form-group">
                    <label>Name (ID) *</label>
                    <input
                      type="text"
                      value={currentCategory.name}
                      onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                      placeholder="e.g., pizza, drinks, sides"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Name *</label>
                    <input
                      type="text"
                      value={currentCategory.displayName}
                      onChange={(e) => setCurrentCategory({...currentCategory, displayName: e.target.value})}
                      placeholder="e.g., Pizzas, Drinks, Sides"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={currentCategory.description}
                      onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input
                      type="number"
                      value={currentCategory.sortOrder}
                      onChange={(e) => setCurrentCategory({...currentCategory, sortOrder: e.target.value})}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ingredients Tab Content */}
      {activeTab === 'ingredients' && (
        <div className="tab-content">
          <div className="products-header">
            <h1>Ingredient Management</h1>
            <button onClick={() => {
              setCurrentIngredient({ 
                optionType: 'topping', 
                name: '', 
                displayName: '', 
                priceModifier: 0, 
                isAvailable: true 
              });
              setIsIngredientModalOpen(true);
            }} className="btn-add-product">+ Add New Ingredient</button>
          </div>
          
          {isLoading ? (
            <p className="loading-text">Loading ingredients...</p>
          ) : (
            <div className="ingredients-sections">
              {Object.entries(ingredients).map(([type, items]) => (
                <div key={type} className="ingredient-section">
                  <h3 className="section-title">
                    {type === 'crust' ? '🍞 Crusts' : 
                     type === 'sauce' ? '🍅 Sauces' : 
                     type === 'cheese' ? '🧀 Cheese' : 
                     type === 'topping' ? '🍕 Toppings' : type}
                    <span className="section-count">({items.length})</span>
                  </h3>
                  <div className="ingredients-grid">
                    {items.map(ingredient => (
                      <div key={ingredient.id} className="ingredient-card">
                        <div className="ingredient-info">
                          <h3>{ingredient.displayName}</h3>
                          <p className="ingredient-price">
                            Price: {ingredient.priceModifier >= 0 ? '+' : ''}${ingredient.priceModifier}
                          </p>
                          <span className={`ingredient-status ${ingredient.isAvailable ? 'available' : 'unavailable'}`}>
                            {ingredient.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="ingredient-actions">
                          <button onClick={() => {
                            setCurrentIngredient({...ingredient});
                            setIsIngredientModalOpen(true);
                          }} className="btn-edit">
                            <FiEdit /> Edit
                          </button>
                          <button onClick={async () => {
                            try {
                              await customizationService.deleteOption(ingredient.id);
                              toast.success('Ingredient deleted!');
                              fetchData();
                            } catch (err) {
                              toast.error('Failed to delete');
                            }
                          }} className="btn-delete">
                            <FiTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ingredient Modal */}
          {isIngredientModalOpen && (
            <div className="modal-overlay" onClick={() => setIsIngredientModalOpen(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{currentIngredient?.id ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (currentIngredient.id) {
                      await customizationService.updateOption(currentIngredient.id, currentIngredient);
                      toast.success('Ingredient updated!');
                    } else {
                      await customizationService.createOption(currentIngredient);
                      toast.success('Ingredient created!');
                    }
                    fetchData();
                    setIsIngredientModalOpen(false);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to save');
                  }
                }}>
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={currentIngredient.optionType}
                      onChange={(e) => setCurrentIngredient({...currentIngredient, optionType: e.target.value})}
                      required
                    >
                      <option value="topping">Topping</option>
                      <option value="sauce">Sauce</option>
                      <option value="crust">Crust/Base</option>
                      <option value="cheese">Cheese</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name (ID) *</label>
                    <input
                      type="text"
                      value={currentIngredient.name}
                      onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
                      placeholder="e.g., pepperoni, tomato-sauce"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Name *</label>
                    <input
                      type="text"
                      value={currentIngredient.displayName}
                      onChange={(e) => setCurrentIngredient({...currentIngredient, displayName: e.target.value})}
                      placeholder="e.g., Pepperoni, Tomato Sauce"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price Modifier ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentIngredient.priceModifier}
                      onChange={(e) => setCurrentIngredient({...currentIngredient, priceModifier: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={currentIngredient.isAvailable}
                        onChange={(e) => setCurrentIngredient({...currentIngredient, isAvailable: e.target.checked})}
                      />
                      Available
                    </label>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" onClick={() => setIsIngredientModalOpen(false)} className="btn-cancel">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
