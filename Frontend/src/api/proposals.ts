import http from './http';

export interface ProposalInput {
  projectId: string;
  coverLetter: string;
  bidAmount: number;
  durationDays: number;
}

export const createProposal = (data: ProposalInput) =>
  http.post(`/project/${data.projectId}/submit-proposal`, {
    coverLetter: data.coverLetter,
    bidAmount: data.bidAmount,
    durationDays: data.durationDays,
  });

export const listMyProposals = () => http.get('/project/proposals/me');
