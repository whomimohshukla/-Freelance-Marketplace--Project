import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser as apiLoginUser } from '../api/auth';
import { logoutUser } from '../api/user';

interface User {
  _id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  username?: string;
  // add other fields as required
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (creds: LoginCredentials, remember: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (creds: LoginCredentials, remember: boolean) => {
    setLoading(true);
    try {
      const { data } = await apiLoginUser(creds);
      if (data.success) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('token', data.token);
        storage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
