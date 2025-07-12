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
