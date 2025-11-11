import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { loginUser as apiLoginUser } from '../api/auth';
import FullPageLoader from '../components/ui/FullPageLoader';
import { logoutUser } from '../api/user';
import freelancerApi from '../api/freelancerApi';
import clientApi from '../api/clientApi';

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
  totpToken?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (creds: LoginCredentials, remember: boolean) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string, remember: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check whether user has completed required profile; redirect if not
  const checkProfileCompletion = async (usr: User) => {
    try {
      if (usr.role === 'freelancer') {
        await freelancerApi.getMyProfile();
      } else if (usr.role === 'client') {
        await clientApi.getMyProfile();
      }
      // success: profile exists
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        if (window.location.pathname !== '/create-profile') {
          window.location.href = '/create-profile';
        }
      }
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUserRaw = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUserRaw && storedUserRaw !== 'undefined') {
      try {
        const parsed = JSON.parse(storedUserRaw);
        setToken(storedToken);
        setUser(parsed);
        // connect socket on boot if we have a token
        connectSocket(storedToken);
        // check profile completion
        checkProfileCompletion(parsed).catch(() => {});
      } catch {
        // malformed, clear
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
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
        connectSocket(data.token);
        // check profile completion post-login
        checkProfileCompletion(data.user).catch(() => {});
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
    disconnectSocket();
  };

  const setAuth = (usr: User, tkn: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', tkn);
    storage.setItem('user', JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
    setAuth,
  };

  if (loading) {
    return <AuthContext.Provider value={value}><FullPageLoader /></AuthContext.Provider>;
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
