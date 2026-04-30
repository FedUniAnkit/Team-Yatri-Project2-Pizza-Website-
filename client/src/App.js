import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import NotificationHandler from './components/common/NotificationHandler';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import RequirePasswordReset from './pages/auth/RequirePasswordReset';

// User Pages
import UserSettings from './pages/user/Settings';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminPromoBanners from './pages/admin/AdminPromoBanners';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProducts from './pages/admin/AdminProducts';

// Staff Pages
import StaffOrders from './pages/staff/StaffOrders';
import StaffOrderDetail from './pages/staff/StaffOrderDetail';
import StaffProducts from './pages/staff/StaffProducts';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container"><div>Loading...</div></div>;
  }

  if (user && user.forcePasswordReset) {
    return <RequirePasswordReset />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Common Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        {/* Legacy / dashboard / track redirects */}
        <Route path="/customer/dashboard" element={<Navigate to="/my-orders" replace />} />
        <Route path="/customer/orders/:id" element={<OrderDetails />} />
        <Route path="/track-order" element={<Navigate to="/my-orders" replace />} />
      </Route>

      {/* Staff dashboard redirect */}
      <Route element={<ProtectedRoute roles={['staff', 'admin']} />}>
        <Route path="/staff/dashboard" element={<Navigate to="/staff/orders" replace />} />
        <Route path="/staff/orders" element={<StaffOrders />} />
        <Route path="/staff/orders/:id" element={<StaffOrderDetail />} />
        <Route path="/staff/products" element={<StaffProducts />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        <Route path="/admin/promo-banners" element={<AdminPromoBanners />} />
        <Route path="/admin/promotions" element={<AdminPromotions />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Not Found Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <div className="App">
              <Navbar />
              <NotificationHandler />
              <main className="main-content">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </SocketProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ top: '80px' }}
          />
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;