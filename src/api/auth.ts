import request from './request'
import type { AxiosResponse } from 'axios'

interface LoginResponse {
  message: string
}

interface RegisterResponse {
  message: string
}

interface RegisterParams {
  username: string
  password: string
  email: string
}


interface LoginPayload {
  password?: string;
  username?: string;
  email?: string;
}

export async function login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> {

  return request.post<LoginResponse>('/auth/login', payload);
}

export async function loginWithSession(): Promise<AxiosResponse<LoginResponse>> {
  // 使用 cookie 登录
  return request.post<LoginResponse>('/auth/session')
}

export async function register(params: RegisterParams): Promise<AxiosResponse<RegisterResponse>> {
  // 用户注册
  return request.post<RegisterResponse>('/auth/register', params)
}
