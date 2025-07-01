import request from './request';
import type { AxiosResponse } from 'axios';
import type { UserProfile } from '@/types/user';

export interface UserProfileResponse {
  success: boolean;
  msg: string;
  data: UserProfile;
  status: number;
}

export function getUserProfile(): Promise<AxiosResponse<UserProfileResponse>> {
  return request.get<UserProfileResponse>('/user/info');
}
