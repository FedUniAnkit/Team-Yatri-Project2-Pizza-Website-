import React, { useState, useEffect, useCallback } from 'react';
import promoCodeService from '../../services/promoCodeService';
import { toast } from 'react-toastify';
import './AdminPromoCodes.css';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    amount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    minimumOrderAmount: '',
    maxDiscountAmount: '',
  });

  const fetchPromoCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await promoCodeService.getAllPromoCodes();
      setPromoCodes(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch promo codes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      amount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      minimumOrderAmount: '',
      maxDiscountAmount: '',
    });
    setEditingCode(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.amount) {
      toast.warn('Code and amount are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        minimumOrderAmount: formData.minimumOrderAmount ? parseFloat(formData.minimumOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (editingCode) {
        await promoCodeService.updatePromoCode(editingCode.id, dataToSubmit);
        toast.success('Promo code updated successfully!');
      } else {
        await promoCodeService.createPromoCode(dataToSubmit);
        toast.success('Promo code created successfully!');
      }

      resetForm();
      fetchPromoCodes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save promo code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (promoCode) => {
    setFormData({
      code: promoCode.code,
      description: promoCode.description || '',
      discountType: promoCode.discountType,
      amount: promoCode.amount,
      startDate: promoCode.startDate ? new Date(promoCode.startDate).toISOString().split('T')[0] : '',
      endDate: promoCode.endDate ? new Date(promoCode.endDate).toISOString().split('T')[0] : '',
      usageLimit: promoCode.usageLimit || '',
      minimumOrderAmount: promoCode.minimumOrderAmount || '',
      maxDiscountAmount: promoCode.maxDiscountAmount || '',
    });
    setEditingCode(promoCode);
    setShowForm(true);
    // Scroll to form so user can see it
    setTimeout(() => {
      document.querySelector('.promo-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await promoCodeService.deletePromoCode(id);
      toast.success('Promo code deleted successfully!');
      fetchPromoCodes();
    } catch (error) {
      toast.error('Failed to delete promo code.');
    }
  };

  const toggleStatus = async (promoCode) => {
    try {
      await promoCodeService.updatePromoCode(promoCode.id, {
        isActive: !promoCode.isActive
      });
      toast.success(`Promo code ${promoCode.isActive ? 'deactivated' : 'activated'}!`);
      fetchPromoCodes();
    } catch (error) {
      toast.error('Failed to update promo code status.');
    }
  };

  const isExpired = (endDate) => {
    return endDate && new Date(endDate) < new Date();
  };

  const isNotYetValid = (startDate) => {
    return startDate && new Date(startDate) > new Date();
  };

  const isUsageLimitReached = (promoCode) => {
    return promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit;
  };

  return (
    <div className="admin-promo-codes-container">
      <div className="header-section">
        <h2>🎟️ Promo Code Management</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Create New Promo Code'}
        </button>
      </div>

      {showForm && (
        <div className="promo-form-section">
          <h3>{editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}</h3>
          <form onSubmit={handleSubmit} className="promo-form">
            <div className="form-row">
              <div className="form-group">
                <label>Promo Code *</label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g., SAVE20"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  style={{ textTransform: 'uppercase' }}
                />
                <small>Will be converted to uppercase</small>
              </div>

              <div className="form-group">
                <label>Discount Type *</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'} *
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 10.00'}
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="e.g., 20% off all orders this weekend"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
                <small>Leave empty for immediate activation</small>
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
                <small>Leave empty for no expiration</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Usage Limit</label>
                <input
                  type="number"
                  name="usageLimit"
                  placeholder="e.g., 100"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="0"
                />
                <small>Max number of uses (empty = unlimited)</small>
              </div>

              <div className="form-group">
                <label>Minimum Order Amount ($)</label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  placeholder="e.g., 25.00"
                  value={formData.minimumOrderAmount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
                <small>Minimum order to use code</small>
              </div>

              {formData.discountType === 'percentage' && (
                <div className="form-group">
                  <label>Max Discount Amount ($)</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    placeholder="e.g., 50.00"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                  <small>Cap for percentage discounts</small>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting} className="btn-submit">
                {isSubmitting ? 'Saving...' : (editingCode ? 'Update Promo Code' : 'Create Promo Code')}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="promo-list-section">
        <h3>All Promo Codes ({promoCodes.length})</h3>
        {isLoading ? (
          <p>Loading promo codes...</p>
        ) : promoCodes.length === 0 ? (
          <p className="no-data">No promo codes found. Create one to get started!</p>
        ) : (
          <div className="promo-table-container">
            <table className="promo-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Usage</th>
                  <th>Valid Period</th>
                  <th>Min Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map(code => (
                  <tr key={code.id} className={!code.isActive ? 'inactive' : ''}>
                    <td>
                      <strong>{code.code}</strong>
                      {code.description && (
                        <div className="description">{code.description}</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${code.discountType}`}>
                        {code.discountType === 'percentage' ? 'Percentage' : 'Fixed'}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {code.discountType === 'percentage' ? `${code.amount}%` : `$${code.amount}`}
                      </strong>
                      {code.maxDiscountAmount && code.discountType === 'percentage' && (
                        <div className="max-discount">Max: ${code.maxDiscountAmount}</div>
                      )}
                    </td>
                    <td>
                      {code.usageCount} / {code.usageLimit || '∞'}
                      {isUsageLimitReached(code) && (
                        <div className="warning">Limit reached</div>
                      )}
                    </td>
                    <td>
                      {code.startDate ? new Date(code.startDate).toLocaleDateString() : 'Now'} 
                      {' → '}
                      {code.endDate ? new Date(code.endDate).toLocaleDateString() : 'No end'}
                      {isExpired(code.endDate) && (
                        <div className="warning">Expired</div>
                      )}
                      {isNotYetValid(code.startDate) && (
                        <div className="info">Not yet valid</div>
                      )}
                    </td>
                    <td>${code.minimumOrderAmount || '0.00'}</td>
                    <td>
                      <button
                        className={`status-toggle ${code.isActive ? 'active' : 'inactive'}`}
                        onClick={() => toggleStatus(code)}
                      >
                        {code.isActive ? '✓ Active' : '✗ Inactive'}
                      </button>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEdit(code)} className="btn-edit">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(code.id)} className="btn-delete">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromoCodes;
