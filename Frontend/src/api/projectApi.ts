import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Project {
  _id: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  selectedFreelancer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  title: string;
  description: string;
  Industry: {
    _id: string;
    name: string;
  };
  skills: Array<{
    skill: {
      _id: string;
      name: string;
    };
    experienceLevel: string;
    priority: string;
  }>;
  budget: {
    type: string;
    currency: string;
    minAmount: number;
    maxAmount: number;
    paid: number;
    pending: number;
  };
  duration: string;
  status: string;
  progress: {
    percentage: number;
    lastUpdated: string;
  };
  proposals: Array<{
    _id: string;
    freelancer: any;
    freelancerProfile?: any;
    coverLetter: string;
    proposedAmount: number;
    estimatedDuration: string;
    status: string;
    submittedAt: string;
  }>;
  milestones: Array<{
    _id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects?: number;
  activeProjects: number;
  completedProjects: number;
  openProjects?: number;
  totalSpent?: number;
  pendingPayments: number;
  totalProposals?: number;
  averageProjectValue?: number;
  pendingProposals?: number;
  totalEarnings?: number;
  acceptedProposals?: number;
  successRate?: string;
  avgProjectValue?: number;
}

export interface FreelancerProfile {
  rating?: {
    average: number;
    count: number;
  };
  hourlyRate?: number;
  availability?: {
    status: string;
    hoursPerWeek: number;
  };
}

export const projectApi = {
  // Client Dashboard
  getClientDashboard: async () => {
    const response = await axios.get(`${API_URL}/project/dashboard/client`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Freelancer Dashboard
  getFreelancerDashboard: async () => {
    const response = await axios.get(`${API_URL}/project/dashboard/freelancer`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Client Projects List
  getClientProjects: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_URL}/project/client/my-projects`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Freelancer Projects List
  getFreelancerProjects: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_URL}/project/freelancer/my-projects`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get Project by ID
  getProjectById: async (projectId: string) => {
    const response = await axios.get(`${API_URL}/project/${projectId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Create Project
  createProject: async (data: any) => {
    const response = await axios.post(`${API_URL}/project/create`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update Project
  updateProject: async (projectId: string, data: any) => {
    const response = await axios.put(`${API_URL}/project/${projectId}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update Project Status
  updateProjectStatus: async (projectId: string, status: string, reason?: string) => {
    const response = await axios.put(
      `${API_URL}/project/${projectId}/status`,
      { status, reason },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Submit Proposal
  submitProposal: async (
    projectId: string,
    data: {
      coverLetter: string;
      proposedAmount: number;
      estimatedDuration: string;
      attachments?: string[];
    }
  ) => {
    const response = await axios.post(
      `${API_URL}/project/${projectId}/submit-proposal`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Get Project Proposals
  getProjectProposals: async (projectId: string) => {
    const response = await axios.get(`${API_URL}/project/${projectId}/proposals`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update Proposal Status
  updateProposalStatus: async (
    projectId: string,
    proposalId: string,
    status: string,
    notes?: string
  ) => {
    const response = await axios.put(
      `${API_URL}/project/${projectId}/proposals/${proposalId}`,
      { status, notes },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Create Milestone
  createMilestone: async (
    projectId: string,
    data: {
      title: string;
      description: string;
      amount: number;
      dueDate: string;
    }
  ) => {
    const response = await axios.post(`${API_URL}/project/${projectId}/milestones`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Update Milestone Status
  updateMilestoneStatus: async (projectId: string, milestoneId: string, status: string) => {
    const response = await axios.put(
      `${API_URL}/project/${projectId}/milestones/${milestoneId}`,
      { status },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Search Projects
  searchProjects: async (params: any) => {
    const response = await axios.get(`${API_URL}/project/search`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get Recommended Projects
  getRecommendedProjects: async (limit?: number) => {
    const response = await axios.get(`${API_URL}/project/recommendations`, {
      params: { limit },
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get My Proposals
  getMyProposals: async () => {
    const response = await axios.get(`${API_URL}/project/proposals/me`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default projectApi;
