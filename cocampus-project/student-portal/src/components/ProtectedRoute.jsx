import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUserFromStorage();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no user data found, redirect to login
  if (!user) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate portal based on user role
    const roleRedirects = {
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      hod: '/hod/dashboard',
      principal: '/principal/dashboard',
      admin: '/admin/dashboard',
      club: '/club/dashboard',
      warden: '/hostel/dashboard',
      canteen: '/canteen/dashboard',
      stall: '/stall/dashboard',
      sports: '/sports/dashboard'
    };

    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
