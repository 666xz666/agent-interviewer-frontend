import request from './request';
import type { AxiosResponse } from 'axios';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export function getUserProfile(): Promise<AxiosResponse<UserProfile>> {
  return request.get<UserProfile>('/api/user/info');
}
