import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer'
  });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!/^\d{10}$/.test(cleaned)) return 'Phone number must be exactly 10 digits';
    if (!/^(04|02|03|07|08)/.test(cleaned)) return 'Must be a valid Australian phone number (starting with 04, 02, 03, 07, or 08)';
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

  // Step 1: Submit form and request OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const phoneError = validatePhone(formData.phone);
    if (phoneError) { toast.error(phoneError); return; }

    const pwErrors = validatePassword(formData.password);
    if (pwErrors.length > 0) { toast.error('Password must contain: ' + pwErrors.join(', ')); return; }

    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await authService.initiateRegister(registerData);
      
      if (result.devOtp) {
        // Dev mode: auto-fill OTP since email wasn't sent
        setOtpDigits(result.devOtp.split(''));
        toast.info('Dev mode: OTP auto-filled (email not configured)');
      } else {
        toast.success('Verification code sent to your email!');
      }
      setStep(2);
      setResendCooldown(60);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtpDigits(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) { toast.error('Please enter the 6-digit code.'); return; }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const data = await authService.verifyRegisterOTP(formData.email, otp);
      toast.success('Registration successful! Welcome to Komorebi Pizza!');

      // Update AuthContext state (token already in localStorage from authService)
      updateUser(data.user);

      switch (data.user.role) {
        case 'admin': navigate('/admin/dashboard'); break;
        case 'staff': navigate('/staff/orders'); break;
        default: navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    try {
      await authService.resendRegisterOTP(formData.email);
      toast.success('New verification code sent!');
      setResendCooldown(60);
    } catch {
      toast.error('Failed to resend code.');
    }
  };

  // Step 2 UI: OTP Verification
  if (step === 2) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FiMail size={40} color="#27ae60" style={{ marginBottom: 12 }} />
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit code to <strong>{formData.email}</strong></p>
          </div>

          {submitError && (
            <div className="auth-error" role="alert" style={{
              background: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb',
              padding: '12px 16px', borderRadius: 6, marginBottom: 16,
            }}>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="otp-input-group" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="otp-input"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
          </form>

          <div className="otp-actions">
            <p style={{ color: '#666', fontSize: '0.88rem', marginTop: 16 }}>
              Didn't receive the code?{' '}
              {resendCooldown > 0 ? (
                <span style={{ color: '#aaa' }}>Resend in {resendCooldown}s</span>
              ) : (
                <button onClick={handleResendOTP} className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Resend Code
                </button>
              )}
            </p>
            <button
              onClick={() => { setStep(1); setOtpDigits(['', '', '', '', '', '']); setSubmitError(null); }}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, fontSize: '0.85rem' }}
            >
              ← Back to registration form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1 UI: Registration Form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join Komorebi Pizza</h2>
          <p>Create your account to start ordering</p>
        </div>

        {submitError && (
          <div className="auth-error" role="alert" aria-live="polite" style={{
            background: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb',
            padding: '12px 16px', borderRadius: 6, marginBottom: 16,
          }}>
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

        <form onSubmit={handleSubmitForm} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Australian 10-digit)</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g. 0412345678" maxLength="10" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password" name="password" value={formData.password} onChange={handleChange}
                required placeholder="Min 6 chars, upper, lower, number, special" minLength="6"
                style={{ paddingRight: '40px' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', alignItems: 'center' }}
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
                id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                required placeholder="Confirm your password" style={{ paddingRight: '40px' }}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', alignItems: 'center' }}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Sending Verification...' : 'Continue'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
