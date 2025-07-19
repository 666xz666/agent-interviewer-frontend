import request from './request'
import type { AxiosResponse } from 'axios'

export interface BaseInfo {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  location: string;
  birthday?: string;
  maritalStatus?: string;
  politicalStatus?: string;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  description?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface ProjectExperience {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies?: string[];
}

export interface Skill {
  name: string;
  level: string;
  description?: string;
}

export interface Certificate {
  name: string;
  issuingOrganization: string;
  dateObtained: string;
}

export interface ResumeData {
  originalFileName: string;
  baseInfo: BaseInfo;
  educationList: Education[];
  workExperienceList: WorkExperience[];
  projectExperienceList?: ProjectExperience[];
  skills?: Skill[];
  certificates?: Certificate[];
  selfEvaluation?: string;
  jobIntention?: string;
}

export interface ResumeListItem {
  resumeId: number;
  originalFileName: string;
  createdAt: string;
}

export interface UpdateResumePayload {
  resumeId: number;
  originalFileName: string;
  baseInfo: BaseInfo;
  educationList: Education[];
  workExperienceList: WorkExperience[];
  projectExperienceList?: ProjectExperience[];
  skills?: Skill[];
  certificates?: Certificate[];
  selfEvaluation?: string;
  jobIntention?: string;
}

// 更新简历响应
export interface UpdateResumeResponse {
  msg: string;
  success: boolean;
  data: ResumeData | null;
  status: number;
}

// API 响应类型
export interface ApiResponse<T> {
  msg: string;
  success: boolean;
  data: T;
  status: number;
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

export interface GetResumeListResponse {
  msg: string;
  success: boolean;
  data: ResumeListItem[];
  status: number;
}

export interface GetResumeResponse {
  msg: string;
  success: boolean;
  data: ResumeData; // 这才是实际的简历数据
  status: number;
}

export interface CreateSimpleResumePayload {
  originalFileName: string;
}

// 添加创建简历接口
export interface CreateResumePayload {
  originalFileName: string;
  baseInfo: BaseInfo;
  educationList: EducationList[];
  workExperienceList: WorkExperienceList[];
}

export interface CreateResumeResponse {
  msg: string;
  success: boolean;
  data: ResumeData | null;
  status: number;
}

export async function getResume(resumeId: number): Promise<AxiosResponse<GetResumeResponse>> {
  return request.get<GetResumeResponse>('/resume/info', {
    params: { resumeId }
  });
}

export async function getResumeList(): Promise<AxiosResponse<GetResumeListResponse>> {
  return request.get<GetResumeListResponse>('/resume/list')
}


export async function createResume(payload: CreateResumePayload): Promise<AxiosResponse<CreateResumeResponse>> {
  return request.post<CreateResumeResponse>('/resume/create', payload)
}

// 添加更新简历接口
export async function updateResume(payload: UpdateResumePayload): Promise<AxiosResponse<UpdateResumeResponse>> {
  return request.post<UpdateResumeResponse>('/resume/update', payload);
}
