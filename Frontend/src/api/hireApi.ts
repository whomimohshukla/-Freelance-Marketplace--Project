import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface HireInvitationData {
  freelancerId: string;
  title: string;
  description: string;
  budgetType: 'Fixed' | 'Hourly' | 'Milestone-based';
  budgetAmount: number;
  duration: string;
  startDate?: string;
  skills?: string[];
  message?: string;
}

export interface HireInvitation {
  _id: string;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  freelancer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  freelancerProfile?: {
    _id: string;
    title: string;
    rating: {
      average: number;
      count: number;
    };
    hourlyRate: number;
  };
  title: string;
  description: string;
  budget: {
    type: string;
    amount: number;
    currency: string;
  };
  duration: string;
  startDate?: string;
  skills: string[];
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Expired';
  clientMessage?: string;
  freelancerResponse?: string;
  project?: string;
  expiresAt: string;
  viewedAt?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const hireApi = {
  // Send hire invitation
  sendInvitation: async (data: HireInvitationData) => {
    const response = await axios.post(`${API_URL}/hire/invite`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get sent invitations (for clients)
  getSentInvitations: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_URL}/hire/sent`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get received invitations (for freelancers)
  getReceivedInvitations: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_URL}/hire/received`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get invitation details
  getInvitationDetails: async (invitationId: string) => {
    const response = await axios.get(`${API_URL}/hire/invitation/${invitationId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Respond to invitation (accept/reject)
  respondToInvitation: async (invitationId: string, status: 'Accepted' | 'Rejected', response?: string) => {
    const res = await axios.put(
      `${API_URL}/hire/respond/${invitationId}`,
      { status, response },
      { headers: getAuthHeader() }
    );
    return res.data;
  },

  // Cancel invitation
  cancelInvitation: async (invitationId: string) => {
    const response = await axios.delete(`${API_URL}/hire/cancel/${invitationId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default hireApi;
