import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../customer/Dashboard.css';

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Staff Dashboard - {user?.name} 👨‍🍳</h1>
        <p>Manage orders and keep the kitchen running smoothly</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>Manage Orders</h3>
          <p>View incoming orders and update their status</p>
          <Link to="/staff/orders" className="card-button">Manage Orders</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🍔</div>
          <h3>Manage Products</h3>
          <p>Add, edit, or remove products from the menu</p>
          <Link to="/staff/products" className="card-button">Manage Products</Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💬</div>
          <h3>Customer Messages</h3>
          <p>Respond to customer inquiries and notes</p>
          <button className="card-button">View Messages</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h3>Notifications</h3>
          <p>Stay updated with new orders and alerts</p>
          <button className="card-button">View Notifications</button>
        </div>
      </div>

      <div className="recent-section">
        <h2>Today's Orders</h2>
        <div className="activity-placeholder">
          <p>No orders yet today. Orders will appear here as they come in.</p>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
