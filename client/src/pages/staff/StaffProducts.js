import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import './StaffProducts.css';

const StaffProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product = null) => {
    setCurrentProduct(product ? { ...product } : { name: '', description: '', price: '', category: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        await productService.updateProduct(currentProduct.id, currentProduct);
        toast.success('Product updated successfully.');
      } else {
        await productService.createProduct(currentProduct);
        toast.success('Product added successfully.');
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted.');
      setConfirmDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="staff-products-container">
      <h1>Product Management</h1>
      <button onClick={() => openModal()} className="btn-add-new">Add New Product</button>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{currentProduct?.id ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleFormSubmit}>
              <input name="name" value={currentProduct.name} onChange={handleFormChange} placeholder="Name" required />
              <textarea name="description" value={currentProduct.description} onChange={handleFormChange} placeholder="Description" required />
              <input name="price" type="number" value={currentProduct.price} onChange={handleFormChange} placeholder="Price" required />
              <input name="category" value={currentProduct.category} onChange={handleFormChange} placeholder="Category" required />
              <input name="imageUrl" value={currentProduct.imageUrl} onChange={handleFormChange} placeholder="Image URL" />
              <div className="modal-actions">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" onClick={closeModal} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-card-manage">
            <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => openModal(product)} className="btn-edit">Edit</button>
              {confirmDeleteId === product.id ? (
                <>
                  <button onClick={() => handleDelete(product.id)} className="btn-delete">Confirm</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="btn-edit">Cancel</button>
                </>
              ) : (
                <button onClick={() => setConfirmDeleteId(product.id)} className="btn-delete">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffProducts;
