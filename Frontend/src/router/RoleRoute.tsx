import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleRouteProps {
  allowed: string[];
}

/**
 * Blocks access to child routes unless the authenticated user's role is allowed.
 * Falls back to login if not authenticated, or to home if role not permitted.
 */
const RoleRoute: React.FC<RoleRouteProps> = ({ allowed }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // could render a spinner
  if (!user) return <Navigate to="/login" replace />;

  return allowed.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />;
};

export default RoleRoute;
