import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && !original?._retry && !original?.url?.endsWith('/delete-account')) {
      original._retry = true;
      try {
        // queue requests while a single refresh is in-flight
        if (isRefreshing) {
          const token = await new Promise<string | null>((resolve) => pendingQueue.push(resolve));
          if (token) original.headers.Authorization = `Bearer ${token}`;
          return http(original);
        }
        isRefreshing = true;
        // attempt refresh
        const { data } = await http.post('/users/refresh-token');
        const newToken: string | undefined = data?.token;
        // decide storage based on where user was stored
        const useLocal = !!localStorage.getItem('user');
        const storage = useLocal ? localStorage : sessionStorage;
        if (newToken) {
          storage.setItem('token', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        // drain queue
        pendingQueue.forEach((resolve) => resolve(newToken || null));
        pendingQueue = [];
        return http(original);
      } catch (e) {
        // drain with null (force logout)
        pendingQueue.forEach((resolve) => resolve(null));
        pendingQueue = [];
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default http;
