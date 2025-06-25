import { useAuth } from '../context/AuthContext';

/**
 * Returns the current signed-in user's role, or undefined if unauthenticated.
 */
export const useRole = () => {
  const { user } = useAuth();
  return user?.role as 'freelancer' | 'client' | 'admin' | undefined;
};
