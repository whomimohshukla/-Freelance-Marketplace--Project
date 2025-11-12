import http from './http';

export const listSkills = (params?: { q?: string; page?: number; limit?: number; sortBy?: 'demand' | 'freelancers' }) =>
  http.get('/skills', { params });

export const listPopularSkills = (limit = 10) =>
  http.get('/skills/popular', { params: { limit } });

export const getSkillById = (id: string) => http.get(`/skills/${id}`);
