import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      setEmail('');
      setPopup({
        show: true,
        type: 'success',
        message: response.data.message || 'Thank you for subscribing! Check your email for confirmation.',
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Subscription failed. Please try again.';
      const isAlreadySubscribed = msg.toLowerCase().includes('already subscribed');
      setPopup({
        show: true,
        type: isAlreadySubscribed ? 'info' : 'error',
        message: msg,
      });
    }
    setIsLoading(false);
  };

  const closePopup = () => setPopup({ show: false, type: '', message: '' });

  return (
    <footer className="site-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>KOMOREBI</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/my-orders">My Orders</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/forgot-password">Forgot Password</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Admin</h3>
              <ul>
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/products">Products</Link></li>
                <li><Link to="/admin/users">Users</Link></li>
                <li><Link to="/admin/analytics">Analytics</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Staff</h3>
              <ul>
                <li><Link to="/staff/orders">Orders</Link></li>
                <li><Link to="/staff/products">Products</Link></li>
              </ul>
            </div>
            
            <div className="footer-column newsletter">
              <h3>Newsletter Subscription</h3>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    className="newsletter-input"
                    placeholder="Subscribe to our newsletter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button type="submit" className="newsletter-btn" disabled={isLoading}>
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>Copyright© {new Date().getFullYear()} KOMOREBI. All rights reserved.</p>
        </div>
      </div>

      {popup.show && (
        <div className="newsletter-popup-overlay" onClick={closePopup}>
          <div className="newsletter-popup" onClick={(e) => e.stopPropagation()}>
            <button className="newsletter-popup-close" onClick={closePopup}>✕</button>
            <div className={`newsletter-popup-icon ${popup.type}`}>
              {popup.type === 'success' ? '🎉' : popup.type === 'info' ? '📧' : '⚠️'}
            </div>
            <h3 className={`newsletter-popup-title ${popup.type}`}>
              {popup.type === 'success' ? 'You\'re In!' : popup.type === 'info' ? 'Already Subscribed' : 'Oops!'}
            </h3>
            <p className="newsletter-popup-message">{popup.message}</p>
            <button className={`newsletter-popup-btn ${popup.type}`} onClick={closePopup}>
              {popup.type === 'success' ? 'Awesome!' : 'Got It'}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
