import http from './http';

// All freelancer-specific endpoints are prefixed with /api/freelancers on the server
export default {
  // Profile
  getMyProfile: () => http.get('/freelancers/profile'),
  updateProfile: (data: any) => http.post('/freelancers/profile', data),

  // Portfolio
  addPortfolioItem: (portfolioItem: any) => http.put('/freelancers/portfolio', { portfolioItem }),
  deletePortfolioItem: (id: string) => http.delete(`/freelancers/portfolio/${id}`),

  // Skills
  updateSkills: (skills: any[]) => http.put('/freelancers/skills', { skills }),

  // Work experience, education, etc.
  addWorkExperience: (data: any) => http.put('/freelancers/work-experience', { workExperience: data }),
  addEducation: (data: any) => http.put('/freelancers/education', { education: data }),
  addCertification: (data: any) => http.put('/freelancers/certifications', { certification: data }),

  // Availability / stats
  updateAvailability: (availability: any) => http.put('/freelancers/availability', { availability }),
  updateStats: (stats: any) => http.put('/freelancers/stats', { stats }),

  // Search freelancers with filters
  searchFreelancers: (params: {
    q?: string;
    skills?: string;           // comma-separated skill names or IDs
    minRate?: number;
    maxRate?: number;
    availability?: string;
    location?: string;
    languages?: string;        // comma-separated languages
    minRating?: number;
    minExperience?: number;
    sort?: 'relevance' | 'rate_asc' | 'rate_desc' | 'rating' | 'experience';
    page?: number;
    limit?: number;
  }) => http.get('/freelancers/search', { params }),
};
