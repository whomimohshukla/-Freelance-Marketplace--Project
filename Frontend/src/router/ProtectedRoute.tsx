import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Blocks access to child routes unless user is authenticated.
 * Shows nothing (or could render a spinner) while auth context is still loading.
 */
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // TODO: render global spinner if desired

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
