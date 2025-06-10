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
  aiFeedbackHints?: AIFeedbackHint[];
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

export interface AIFeedbackHint {
  timestamp: string; // 提示出现的时间点
  type: HintType; // 提示的类型
  message: string; // 提示的具体内容
}

export enum HintType {
  PACE_TOO_FAST = 'pace_too_fast', // 语速过快
  PACE_TOO_SLOW = 'pace_too_slow', // 语速过慢
  LACK_OF_KEYWORDS = 'lack_of_keywords', // 缺乏关键词
  FILLER_WORD_OVERUSE = 'filler_word_overuse', // 口头禅过多
}
