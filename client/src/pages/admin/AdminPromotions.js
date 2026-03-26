import React, { useState, useEffect } from 'react';
import promotionService from '../../services/promotionService';
import './AdminPromotions.css'; // We will create this file for styling

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const response = await promotionService.getAllPromotions();
      setPromotions(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch promotions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (promotion = null) => {
    setCurrentPromotion(promotion ? { ...promotion } : { code: '', description: '', discountType: 'percentage', amount: 0, startDate: '', endDate: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPromotion(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPromotion(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPromotion.id) {
        await promotionService.updatePromotion(currentPromotion.id, currentPromotion);
      } else {
        await promotionService.createPromotion(currentPromotion);
      }
      fetchPromotions();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save promotion. Please check the details.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await promotionService.deletePromotion(id);
      setConfirmDeleteId(null);
      fetchPromotions();
    } catch (err) {
      setError('Failed to delete promotion.');
      console.error(err);
    }
  };

  return (
    <div className="admin-promotions-container">
      <h2>Manage Promotions</h2>
      <button onClick={() => handleOpenModal()} className="add-promo-btn">Add New Promotion</button>
      
      {error && <p className="error-message">{error}</p>}
      {isLoading ? <p>Loading promotions...</p> : (
        <table className="promotions-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td>{promo.code}</td>
                <td>{promo.description}</td>
                <td>{promo.discountType}</td>
                <td>{promo.discountType === 'fixed' ? `$${promo.amount}` : `${promo.amount}%`}</td>
                <td>{promo.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleOpenModal(promo)} className="action-btn edit-btn">Edit</button>
                  {confirmDeleteId === promo.id ? (
                    <>
                      <button onClick={() => handleDelete(promo.id)} className="action-btn delete-btn">Confirm</button>
                      <button onClick={() => setConfirmDeleteId(null)} className="action-btn edit-btn">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(promo.id)} className="action-btn delete-btn">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentPromotion.id ? 'Edit Promotion' : 'Add Promotion'}</h3>
            <form onSubmit={handleSubmit}>
              <input name="code" value={currentPromotion.code} onChange={handleInputChange} placeholder="Promo Code" required />
              <textarea name="description" value={currentPromotion.description} onChange={handleInputChange} placeholder="Description"></textarea>
              <select name="discountType" value={currentPromotion.discountType} onChange={handleInputChange}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input type="number" name="amount" value={currentPromotion.amount} onChange={handleInputChange} placeholder="Amount" required />
              <input type="date" name="startDate" value={currentPromotion.startDate.split('T')[0]} onChange={handleInputChange} placeholder="Start Date" />
              <input type="date" name="endDate" value={currentPromotion.endDate.split('T')[0]} onChange={handleInputChange} placeholder="End Date" />
              <label>
                <input type="checkbox" name="isActive" checked={currentPromotion.isActive} onChange={handleInputChange} />
                Active
              </label>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;
