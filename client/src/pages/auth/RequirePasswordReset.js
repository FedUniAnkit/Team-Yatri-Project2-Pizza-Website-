import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import './RequirePasswordReset.css';

const RequirePasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth(); // We need login to refresh the user state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    
    setLoading(true);
    try {
      // This assumes you have a service function to handle this specific API call
      const data = await authService.updatePasswordForced({ newPassword });
      
      // Re-login the user with the new token to update the auth context
      // This is a simplified way to refresh the user's state including the `forcePasswordReset` flag
      const freshUser = authService.getCurrentUser();
      const token = authService.getToken();

      if(freshUser && token) {
        // Manually dispatch a login success to update the context
        // This is a bit of a hack. A better way would be for the update password endpoint
        // to return the full user object and new token, then update context with that.
        // For now, we assume the service updates the localStorage.
         window.location.reload(); // Easiest way to force a state refresh
      }

      toast.success('Password updated successfully! You can now access the site.');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Password Reset Required</h2>
        <p>For security reasons, you must reset your password before you can continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequirePasswordReset;
