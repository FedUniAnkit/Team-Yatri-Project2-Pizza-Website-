import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Supports two usages:
// 1) Wrapper with nested routes (recommended):
//    <Route element={<ProtectedRoute roles={["admin"]} />}> <Route path="/admin" .../> </Route>
//    In this case we render <Outlet />
// 2) Direct children usage:
//    <ProtectedRoute><SomeComponent/></ProtectedRoute>
//    In this case we render children
const ProtectedRoute = ({ children, requiredRole, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Support either a single requiredRole or an array of roles
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (roles && Array.isArray(roles) && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If used with children, render them; otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
