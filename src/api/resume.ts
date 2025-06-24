import request from './request'
import type { AxiosResponse } from 'axios'

interface BasicInfo {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  location: string;
}

interface EducationList {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

interface WorkExperienceList {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  resumeId?: number;
  originalFileName: string;
  baseInfo: BasicInfo;
  educationList: EducationList[];
  workExperienceList: WorkExperienceList[];
  createdAt?: string;
}

export interface ResumeListItem {
  resumeId?: number;
  originalFileName: string;
  status?: string;
  errorMessage?: string;
  createdAt?: string;
}

export interface GetResumeListResponse {
  msg: string;
  success: boolean;
  data: ResumeListItem[];
  status: number;
}

export interface CreateResumeResponse {
  success: boolean;
  msg: string;
  data: ResumeData;
  status: number;
}

export interface CreateSimpleResumePayload {
  originalFileName: string;
}

export async function getResume(resumeId: number): Promise<AxiosResponse<ResumeData>> {
  return request.get<ResumeData>('/resume/info', {
    params: {
      id: resumeId
    }
  });
}

export async function getResumeList(): Promise<AxiosResponse<GetResumeListResponse>> {
  return request.get<GetResumeListResponse>('/resume/list');
}

export async function createNewResume(payload: CreateSimpleResumePayload): Promise<AxiosResponse<CreateResumeResponse>> {
  return request.post<CreateResumeResponse>('/resume/create', payload);
}
