import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 🍕</h1>
        <p>Ready to order some delicious pizza?</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🛒</div>
          <h3>Browse Menu</h3>
          <p>Explore our delicious pizza selection and place your order</p>
          <Link to="/menu" className="card-button">View Menu</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>Order History</h3>
          <p>View your past orders and reorder your favorites</p>
          <Link to="/customer/my-orders" className="card-button">View Orders</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👤</div>
          <h3>Profile Settings</h3>
          <p>Update your personal information and delivery address</p>
          <button className="card-button">Edit Profile</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h3>Track Order</h3>
          <p>Track your current order status in real-time</p>
          <button className="card-button">Track Order</button>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Activity</h2>
        <div className="activity-placeholder">
          <p>No recent orders. Ready to place your first order?</p>
          <button className="btn btn-primary">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
