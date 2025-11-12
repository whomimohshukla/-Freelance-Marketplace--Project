import http from './http';

export interface SendMessageInput {
  receiver: string;
  content: string;
  project?: string;
  attachments?: { name: string; url: string; type?: string }[];
  messageType?: 'text' | 'file' | 'system' | 'video_call_invite';
}

export const sendMessage = (data: SendMessageInput) => http.post('/messages', data);

export const getThread = (userId: string, params?: { project?: string }) =>
  http.get(`/messages/thread/${userId}`, { params });

export const getUnreadCount = () => http.get('/messages/unread-count');

export const markRead = (messageId: string) => http.patch(`/messages/${messageId}/read`, {});
