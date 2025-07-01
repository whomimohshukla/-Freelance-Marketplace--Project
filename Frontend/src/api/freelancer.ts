import http from './http';

// Type definitions (adjust fields as needed)
export interface SkillInput {
  skill: string; // ObjectId of Skill
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  yearsOfExperience?: number;
}

export interface PortfolioItemInput {
  title: string;
  description?: string;
  projectUrl?: string;
  images?: { url: string; caption?: string }[];
  technologies?: string[];
  completionDate?: Date | string;
}

export interface EducationInput {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  current?: boolean;
  description?: string;
}

export interface WorkExpInput {
  company: string;
  position: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  current?: boolean;
  achievements?: string[];
}

export interface CertificationInput {
  name: string;
  issuer?: string;
  issueDate?: Date | string;
  expiryDate?: Date | string;
  credentialUrl?: string;
}

export interface AvailabilityInput {
  status: 'Available' | 'Partially Available' | 'Not Available';
  hoursPerWeek?: number;
  timezone?: string;
}

/* ------------------------- Core profile endpoints ------------------------ */
export const createOrUpdateProfile = (data: Record<string, any>) =>
  http.post('/freelancers/profile', data);

export const getProfile = (userId: string) =>
  http.get(`/freelancers/profile/${userId}`);

/* --------------------------- Portfolio routes ---------------------------- */
export const addPortfolioItem = (item: PortfolioItemInput) =>
  http.put('/freelancers/portfolio', { portfolioItem: item });

export const deletePortfolioItem = (portfolioId: string) =>
  http.delete(`/freelancers/portfolio/${portfolioId}`);

/* ------------------------------ Skills ----------------------------------- */
export const updateSkills = (skills: SkillInput[]) =>
  http.put('/freelancers/skills', { skills });

/* ------------------------- Work Experience ------------------------------- */
export const addWorkExperience = (workExperience: WorkExpInput) =>
  http.put('/freelancers/work-experience', { workExperience });

/* ----------------------------- Education --------------------------------- */
export const addEducation = (education: EducationInput) =>
  http.put('/freelancers/education', { education });

/* -------------------------- Certifications ------------------------------- */
export const addCertification = (certifications: CertificationInput) =>
  http.put('/freelancers/certifications', { certifications });

/* --------------------------- Availability -------------------------------- */
export const updateAvailability = (availability: AvailabilityInput) =>
  http.put('/freelancers/availability', { availability });

/* ------------------------------ Stats ------------------------------------ */
export const updateStats = (stats: Record<string, any>) =>
  http.put('/freelancers/stats', { stats });

/* -------------------------- Social Profiles ------------------------------ */
export const updateSocialProfiles = (socialProfiles: Record<string, string>) =>
  http.put('/freelancers/social', { socialProfiles });

/* --------------------------- Search & list ------------------------------- */
export const searchFreelancers = (params: Record<string, any>) =>
  http.get('/freelancers/search', { params });

export const getTopRatedFreelancers = (limit = 5) =>
  http.get('/freelancers/top-rated', { params: { limit } });
