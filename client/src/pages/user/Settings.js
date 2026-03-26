import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../components/user/UserSettings.css';

const Settings = () => {
  const { updateUser } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const loadingRef = useRef(false);

  const fetchUserData = async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      console.log('Already loading user data, skipping...');
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in again to access your account settings.');
        window.location.href = '/login';
        return;
      }
      
      console.log('Fetching user data...');
      const response = await api.get('/users/me');
      console.log('User data response:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error('Invalid response format');
      }
      
      const fetchedUser = response.data.user;
      
      if (!fetchedUser) {
        throw new Error('User data not found in response');
      }
      
      setUserData({
        name: fetchedUser.name || '',
        email: fetchedUser.email || '',
        phone: fetchedUser.phone || '',
        address: {
          street: fetchedUser.address?.street || '',
          city: fetchedUser.address?.city || '',
          state: fetchedUser.address?.state || '',
          zipCode: fetchedUser.address?.zipCode || ''
        }
      });
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in again to access your account settings.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        toast.error('User account not found. Please contact support.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load user data';
        toast.error(errorMessage);
      }
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!userData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.put('/users/me', userData);
      const updatedUser = response?.data?.data || response?.data?.user;
      
      if (updatedUser) {
        updateUser(updatedUser);
      }
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      setIsSaving(true);
      await api.patch('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Update password error:', error);
      const message = error.response?.data?.message || 'Failed to update password. Please try again.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="settings-container">
        <div className="settings-card">
          <div className="loading-spinner">
            <h2>Loading your account information...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>View and manage your account information</p>
      </div>
      
      <div className="settings-content">
        {/* Profile Information Section */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserData(); // Reset to original data
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <form onSubmit={handleProfileUpdate} className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="disabled-field"
                />
                <small className="form-text">Email cannot be changed</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="address-section">
              <h4>Address Information</h4>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address.street">Street Address</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={userData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={userData.address.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address.state">State</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={userData.address.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address.zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={userData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter your ZIP code"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
        
        {/* Password Section */}
        <div className="settings-card">
          <div className="card-header">
            <h3>Password & Security</h3>
            {!showPasswordForm ? (
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            ) : (
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
          
          {!showPasswordForm ? (
            <div className="password-info">
              <p>Your password is secure and encrypted.</p>
              <p className="text-muted">Last updated: Never changed</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordUpdate} className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  required
                />
                <small className="form-text">
                  Password must be at least 8 characters long
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
