import http from './http';

export interface UploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

export interface UploadResponse {
  success: boolean;
  url: string;
  public_id: string;
}

export const uploadFile = (file: string, options: UploadOptions = {}) =>
  http.post<UploadResponse>('/uploads', { file, ...options });
