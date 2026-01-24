import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Guards routes by checking auth (and optional role for admin pages).
export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading session...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/" replace />;

  return children;
}