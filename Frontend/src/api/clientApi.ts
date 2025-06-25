import http from './http';

// All client-specific endpoints are prefixed with /api/clients on the server
export default {
  // Profile
  getMyProfile: () => http.get('/clients/profile'),
  updateProfile: (data: any) => http.post('/clients/profile', data),

  // Company / business details helpers (examples)
  updateCompany: (company: any) => http.put('/clients/company', { company }),
  updateBusinessDetails: (businessDetails: any) => http.put('/clients/business-details', { businessDetails }),

  // Team
  addTeamMember: (teamMember: any) => http.put('/clients/team', { teamMember }),
  removeTeamMember: (memberId: string) => http.delete(`/clients/team/${memberId}`),

  // Financials / stats
  updateFinancials: (financials: any) => http.put('/clients/financials', { financials }),
  updateStats: (stats: any) => http.put('/clients/stats', { stats }),
};
