import React, { useState, useEffect, useCallback } from 'react';
import promoBannerService from '../../services/promoBannerService';
import uploadService from '../../services/uploadService';
import { toast } from 'react-toastify';
import './AdminPromoBanners.css';

const AdminPromoBanners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    promoCode: '',
    style: 'gradient',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    isActive: false,
    startDate: '',
    endDate: '',
  });

  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await promoBannerService.getAllBanners();
      setBanners(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch promo banners.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      promoCode: '',
      style: 'gradient',
      imageUrl: '',
      ctaText: '',
      ctaLink: '',
      isActive: false,
      startDate: '',
      endDate: '',
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Please upload an image smaller than 2MB.');
      return;
    }
    setUploadingImage(true);
    try {
      const response = await uploadService.uploadImage(file);
      const url = response.data?.url || response.url;
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        title: formData.title,
        message: formData.message,
        promoCode: formData.promoCode || null,
        style: formData.style,
        imageUrl: formData.imageUrl || null,
        ctaText: formData.ctaText || null,
        ctaLink: formData.ctaLink || null,
        isActive: formData.isActive,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (editingBanner) {
        await promoBannerService.updateBanner(editingBanner.id, dataToSubmit);
        toast.success('Promo banner updated successfully!');
      } else {
        await promoBannerService.createBanner(dataToSubmit);
        toast.success('Promo banner created successfully!');
      }
      resetForm();
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      message: banner.message,
      promoCode: banner.promoCode || '',
      style: banner.style,
      imageUrl: banner.imageUrl || '',
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
    });
    setEditingBanner(banner);
    setShowForm(true);
    setTimeout(() => {
      document.querySelector('.banner-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo banner?')) return;
    try {
      await promoBannerService.deleteBanner(id);
      toast.success('Promo banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner.');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await promoBannerService.updateBanner(banner.id, { isActive: !banner.isActive });
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}!`);
      fetchBanners();
    } catch (error) {
      toast.error('Failed to toggle banner status.');
    }
  };

  if (isLoading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-promo-banners">
      <h1>🎉 Promo Banners</h1>
      <p>Create flashy promotional banners that appear on the homepage</p>

      <button className="btn-create" onClick={() => { resetForm(); setShowForm(true); }}>
        ➕ Create New Banner
      </button>

      {showForm && (
        <div className="banner-form-section">
          <h3>{editingBanner ? 'Edit Promo Banner' : 'Create New Promo Banner'}</h3>
          <form onSubmit={handleSubmit} className="banner-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Mother's Day Special"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Message *</label>
                <input
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="e.g., Get 10% off all orders!"
                  required
                  maxLength={200}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Promo Code (Optional)</label>
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="e.g., MOTHER10"
                  style={{ textTransform: 'uppercase' }}
                  maxLength={50}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Style</label>
                <select name="style" value={formData.style} onChange={handleInputChange}>
                  <option value="gradient">🌈 Gradient (Default)</option>
                  <option value="festive">🎊 Festive</option>
                  <option value="elegant">🖤 Elegant Dark</option>
                  <option value="fresh">🌿 Fresh Green</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Banner Image</label>
                {formData.imageUrl ? (
                  <div className="banner-image-preview">
                    <img src={formData.imageUrl} alt="Banner" />
                    <button type="button" onClick={handleRemoveImage} className="btn-remove-image">Remove</button>
                  </div>
                ) : (
                  <label className="image-upload-tile">
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                    {uploadingImage ? 'Uploading…' : 'Upload Image'}
                  </label>
                )}
                <small>Recommended size: 1600×400 px, JPG/PNG under 2MB.</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CTA Button Text</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  placeholder="e.g., Shop Now"
                  maxLength={80}
                />
              </div>
              <div className="form-group">
                <label>CTA Link</label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleInputChange}
                  placeholder="e.g., /menu or https://promo"
                  maxLength={255}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date (Optional)</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Active (Only one banner can be active at a time)</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting} className="btn-submit">
                {isSubmitting ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="banners-list">
        {banners.length === 0 ? (
          <p className="no-banners">No promo banners yet. Create your first one!</p>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className={`banner-card ${banner.isActive ? 'active' : ''}`}>
              <div className="banner-info">
                <h3>{banner.title}</h3>
                <p>{banner.message}</p>
                {banner.promoCode && <span className="banner-code-display">Code: {banner.promoCode}</span>}
                {banner.ctaText && <span className="banner-cta-display">CTA: {banner.ctaText}</span>}
                {banner.imageUrl && (
                  <div className="banner-image-thumb">
                    <img src={banner.imageUrl} alt={banner.title} />
                  </div>
                )}
                <div className="banner-meta">
                  <span className="banner-style">{banner.style}</span>
                  {banner.startDate && <span>Start: {new Date(banner.startDate).toLocaleDateString()}</span>}
                  {banner.endDate && <span>End: {new Date(banner.endDate).toLocaleDateString()}</span>}
                  <span className={`banner-status ${banner.isActive ? 'active' : 'inactive'}`}>
                    {banner.isActive ? '✓ Active' : '○ Inactive'}
                  </span>
                </div>
              </div>
              <div className="banner-actions">
                <button onClick={() => handleToggleActive(banner)} className="btn-toggle">
                  {banner.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                </button>
                <button onClick={() => handleEdit(banner)} className="btn-edit">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(banner.id)} className="btn-delete">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPromoBanners;
