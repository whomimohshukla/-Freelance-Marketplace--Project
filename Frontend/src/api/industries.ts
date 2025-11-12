import http from './http';

export const listIndustries = (params?: { q?: string; page?: number; limit?: number; sort?: string }) =>
  http.get('/industries', { params });

export const getIndustry = (idOrSlug: string) => http.get(`/industries/${idOrSlug}`);

export const getTrendingIndustries = () => http.get('/industries/trending');

export const getChildIndustries = (parentId: string) => http.get(`/industries/${parentId}/children`);
