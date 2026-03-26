import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';
import { FaGooglePlus, FaVk } from 'react-icons/fa';
import api from '../../services/api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      toast.success(response.data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <footer className="site-footer">
      {/* Social Icons Section */}
      <div className="footer-social-top">
        <div className="container">
          <div className="social-icons-top">
            <a href="#" className="social-icon" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="social-icon" aria-label="Google Plus">
              <FaGooglePlus />
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <FiYoutube />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="#" className="social-icon" aria-label="VK">
              <FaVk />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>KOMOREBI</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/news">News</Link></li>
                <li><Link to="/partners">Partners</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Social</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Youtube</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Service</h3>
              <ul>
                <li><Link to="/menu">Compare</Link></li>
                <li><Link to="/download">Download</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
                <li><Link to="/bug-report">Bug Report</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Activity</h3>
              <ul>
                <li><Link to="/influencers">Influencers</Link></li>
                <li><Link to="/affiliate">Affiliate</Link></li>
                <li><Link to="/co-branding">Co-branding</Link></li>
                <li><Link to="/honor">Honor</Link></li>
                <li><Link to="/giveaway">Giveaway</Link></li>
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
    </footer>
  );
};

export default Footer;
