import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!/^\d{10}$/.test(cleaned)) {
      return 'Phone number must be exactly 10 digits';
    }
    if (!/^(04|02|03|07|08)/.test(cleaned)) {
      return 'Must be a valid Australian phone number (starting with 04, 02, 03, 07, or 08)';
    }
    return null;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push('at least 6 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*()_+\-={}[\]|;:'",.<>?/`~]/.test(password)) errors.push('one special character');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Australian phone number
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    // Validate password strength
    const pwErrors = validatePassword(formData.password);
    if (pwErrors.length > 0) {
      toast.error('Password must contain: ' + pwErrors.join(', '));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      toast.success('Registration successful!');
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'staff':
          // Staff dashboard route not defined; send to orders page
          navigate('/staff/orders');
          break;
        case 'customer':
          // No /customer/dashboard route; send to home or menu
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || 'Registration failed';
      setSubmitError(serverMessage);
      toast.error(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join Komorebi Pizza</h2>
          <p>Create your account to start ordering</p>
        </div>

        {submitError && (
          <div
            className="auth-error"
            role="alert"
            aria-live="polite"
            style={{
              background: '#fdecea',
              color: '#b71c1c',
              border: '1px solid #f5c6cb',
              padding: '12px 16px',
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            {/* If server sent multiple validation messages joined by comma, show as list */}
            {submitError.includes(',') ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {submitError.split(',').map((msg, idx) => (
                  <li key={idx}>{msg.trim()}</li>
                ))}
              </ul>
            ) : (
              <span>{submitError}</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Australian 10-digit)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="e.g. 0412345678"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min 6 chars, upper, lower, number, special"
                minLength="6"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              Must contain: uppercase, lowercase, number, and special character
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
