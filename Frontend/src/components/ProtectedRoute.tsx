import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  requiredRole?: string;
}

/**
 * Usage in router:
 * {
 *   path: '/dashboard',
 *   element: <ProtectedRoute requiredRole="freelancer" />, // optional role
 *   children: [...routes]
 * }
 */
const ProtectedRoute: React.FC<Props> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />; // create this page or redirect elsewhere
  }

  return <Outlet />;
};

export default ProtectedRoute;
