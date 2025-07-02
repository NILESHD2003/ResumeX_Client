import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isTokenValid = () => {
  const tokenData = localStorage.getItem('authToken');
  if (!tokenData) return false;

  const { expiry } = JSON.parse(tokenData);
  if (Date.now() > expiry) {
    localStorage.removeItem('authToken');
    return false;
  }

  return true;
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  return isTokenValid() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
