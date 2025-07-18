import request from './request'
import type { AxiosResponse } from 'axios'

// 前端使用的结果类型
interface ExpressionAnalysisResult {
  emotion: string
  confidence: number
  isFace: boolean
}

// 后端返回的数据类型
interface ExpressionAnalysisResponse {
  code: number
  data: {
    fileList: Array<{
      label: number
      rate: number
    }>
  }
  desc: string
}

// 面试官类型
export interface Interviewer {
  interviewerId: number
  name: string
  gender: string
  description: string
  apiServiceId: string
  createdAt: string
  updatedAt: string
}

// 岗位类型
export interface Job {
  jobId: number
  jobName: string
  jobDescription: string
  techStack: string[]
  creatorName: string
}

// 知识库类型
export interface KnowledgeBase {
  knowledgeId: number
  knowledgeName: string
  description: string
}

// API响应类型
export interface ApiResponse<T> {
  msg: string
  success: boolean
  data: T
  status: number
}

// 获取面试官列表
export async function getInterviewerList(): Promise<AxiosResponse<ApiResponse<Interviewer[]>>> {
  return request.get('/interviewer/list')
}

// 获取岗位列表
export async function getJobList(): Promise<AxiosResponse<ApiResponse<Job[]>>> {
  return request.get('/list')
}

// 获取知识库列表
export async function getKnowledgeBaseList(jobId: number): Promise<AxiosResponse<ApiResponse<KnowledgeBase[]>>> {
  return request.get('/kb/list', { params: { jobId } })
}

// 创建面试
export async function createInterview(params: {
  interviewerId: number
  resumeId: number
  jobId: number
  knowledgeBaseId: number  // 注意这里改为knowledgeBaseId而不是knowledgeId
}): Promise<AxiosResponse<ApiResponse<{
  interviewId: number
  userId: number
  jobId: number
  startTime: string
  endTime: string | null
  status: string
  rabbitmqTotalJobId: string | null
  createdAt: string | null
  interviewerId: number
  resumeId: number
}>>> {
  return request.post('/interview/create', null, {
    params: params  // 注意参数是通过URL query传递的
  })
}

// 面试记录接口类型
export interface InterviewListItem {
  interviewId: number;
  jobId: number;
  jobName: string;
  resumeId: number;
  resumeName: string;
  startTime: string;
  endTime: string | null;
  status: 'PROCESSING' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  interviewerId: number;
}

export interface GetInterviewListResponse {
  msg: string;
  success: boolean;
  data: InterviewListItem[];
  status: number;
}

const emotionMap: Record<number, string> = {
  0: '非人脸',
  1: '其他表情',
  2: '喜悦',
  3: '愤怒',
  4: '悲伤',
  5: '惊恐',
  6: '厌恶',
  7: '中性'
}

export async function analyzeExpression(imageData: Blob): Promise<ExpressionAnalysisResult> {
  const formData = new FormData()
  formData.append('file', imageData, 'face.jpg')

  const response: AxiosResponse<ExpressionAnalysisResponse> = await request.post(
    '/face/expressionAnalysis',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  if (response.data.code !== 0 || !response.data.data.fileList.length) {
    throw new Error('表情分析失败: ' + (response.data.desc || '未知错误'))
  }

  const result = response.data.data.fileList[0]
  return {
    emotion: emotionMap[result.label] || '未知表情',
    confidence: result.rate,
    isFace: result.label !== 0 // 0表示非人脸
  }
}

export async function getInterviewList(): Promise<AxiosResponse<GetInterviewListResponse>> {
  return request.get<GetInterviewListResponse>('/interview/list');
}
