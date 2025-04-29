import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  const shouldRedirectToLogin = !isAuthenticated;
  const shouldRedirectToHome = allowedRoles && !allowedRoles.includes(userRole);

  if (shouldRedirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  if (shouldRedirectToHome) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
