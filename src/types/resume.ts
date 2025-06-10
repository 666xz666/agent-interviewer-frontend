// 简历相关类型定义

export interface Resume {
  id: string
  userId: string
  content: ResumeContent
  createdAt: string
  updatedAt: string
}

export interface ResumeContent {
  basicInfo: BasicInfo
  education: Education[]
  workExperience: WorkExperience[]
  projects: Project[]
  skills: string[]
}

export interface BasicInfo {
  name: string
  email: string
  phone: string
  location: string
  position: string
}

export interface Education {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string[]
}

export interface Project {
  name: string
  role: string
  startDate: string
  endDate: string
  description: string[]
  technologies: string[]
}

export interface ResumeEvaluation {
  id: string
  resumeId: string
  evaluation: string
  suggestions: string[]
  modifiedContent?: ResumeContent
  createdAt: string
}
