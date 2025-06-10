// 面试相关类型定义

export interface Interview {
  id: string
  userId: string
  resume: string // resumeId
  startTime: string
  endTime: string
  status: InterviewStatus
  recording: Recording
  evaluation?: InterviewEvaluation
}

export enum InterviewStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Recording {
  id: string
  interviewId: string
  audioUrl: string
  videoUrl: string
  transcript: string
}

export interface InterviewEvaluation {
  id: string
  interviewId: string
  scores: SkillScores
  feedback: string
  keyIssues: string[]
  recommendations: string[]
  createdAt: string
}

export interface SkillScores {
  knowledgeLevel: number
  skillMatch: number
  communication: number
  logicalThinking: number
  creativity: number
  stressHandling: number
}

export interface InterviewQuestion {
  id: string
  type: QuestionType
  content: string
  answer?: string
  position: string // positionId
}

export enum QuestionType {
  GREETING = 'greeting',
  BASIC = 'basic',
  RESUME = 'resume',
  SCENARIO = 'scenario',
  CLOSING = 'closing'
}
