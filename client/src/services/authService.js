import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Update password when forced
  updatePasswordForced: async (passwordData) => {
    const response = await api.patch('/auth/update-forced-password', passwordData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // OTP Registration - Step 1: Send OTP
  initiateRegister: async (userData) => {
    const response = await api.post('/auth/register/initiate', userData);
    return response.data;
  },

  // OTP Registration - Step 2: Verify OTP and create user
  verifyRegisterOTP: async (email, otp) => {
    const response = await api.post('/auth/register/verify-otp', { email, otp });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // OTP Registration - Resend OTP
  resendRegisterOTP: async (email) => {
    const response = await api.post('/auth/register/resend-otp', { email });
    return response.data;
  },

  // Create staff account (admin only)
  createStaff: async (staffData) => {
    const response = await api.post('/auth/create-staff', staffData);
    return response.data;
  }
};

export default authService;
