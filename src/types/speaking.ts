// 口语练习相关类型定义

export interface SpeakingPractice {
  id: string
  userId: string
  language: string
  text: string
  wordCount: number
  audioUrl: string
  evaluation?: SpeakingEvaluation
  createdAt: string
}

export interface SpeakingEvaluation {
  id: string
  practiceId: string
  pronunciation: number // 发音准确度评分 0-100
  fluency: number      // 流畅度评分 0-100
  completeness: number // 完整度评分 0-100
  speed: number        // 语速评分 0-100
  feedback: string[]
  timestamp: string
}

export interface PracticeText {
  id: string
  language: string
  content: string
  wordCount: number
  difficulty: TextDifficulty
  category: string
  createdAt: string
}

export enum TextDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum SupportedLanguage {
  ENGLISH = 'english',
  CHINESE = 'chinese',
  JAPANESE = 'japanese',
  KOREAN = 'korean',
  FRENCH = 'french',
  GERMAN = 'german',
  SPANISH = 'spanish'
}
