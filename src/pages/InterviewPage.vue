<template>
  <div class="interview-page-container">
    <div class="video-panel">
      <el-card class="video-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>我的视频</span>
            <div v-if="expressionResult" class="expression-result">
              <el-tag :type="getEmotionTagType(expressionResult.emotion)" size="large">
                {{ expressionResult.emotion }}
              </el-tag>
            </div>
          </div>
        </template>
        <div class="video-wrapper">
          <video ref="videoRef" class="video-feed" autoplay muted playsinline></video>

          <div v-if="!isCameraReady" class="video-placeholder">
            <el-icon :size="50"><CameraFilled /></el-icon>
            <p>{{ cameraStatusText }}</p>
          </div>
        </div>
        <div class="controls">
          <el-button v-if="!isInterviewing" type="success" size="large" @click="startInterview" :icon="VideoPlay">
            创建面试
          </el-button>
          <el-button v-else type="danger" size="large" @click="endInterview" :icon="VideoPause">
            结束面试
          </el-button>
        </div>
      </el-card>
    </div>

    <div class="chat-panel">
      <el-card class="chat-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>面试对话</span>
          </div>
        </template>
        <div class="chat-window" ref="chatWindowRef">
          <div v-for="(message, index) in chatHistory" :key="index" class="message-wrapper">
            <div :class="['message', message.role]">
              <div class="avatar">
                <img v-if="message.role === 'user'" src="@/assets/images/user-avatar.png" alt="用户">
                <img v-else src="@/assets/images/ai-avatar.png" alt="AI">
              </div>
              <div class="bubble">
                <div class="content">
                  <p>{{ message.content }}</p>
                </div>
                <div class="arrow"></div>
              </div>
            </div>
            <div class="message-time" v-if="message.time">
              {{ message.time }}
            </div>
          </div>

          <div v-if="isAiThinking" class="message-wrapper">
            <div class="message assistant">
              <div class="avatar">
                <img src="@/assets/images/ai-avatar.png" alt="AI">
              </div>
              <div class="bubble">
                <div class="content thinking">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
                <div class="arrow"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <p class="voice-tip">
            <el-icon v-if="isRecording" class="recording-icon">
              <Mic />
            </el-icon>
            {{ isRecording ? '正在聆听中...' : '请通过语音回答，系统将自动识别' }}
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { VideoPlay, VideoPause, CameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { analyzeExpression } from '@/api/interview'
import { createRecorder } from '@/pages/recoder';
import { getWebSocketUrl, arrayBufferToBase64, processRecognitionResult, resetRecognitionResult } from '@/pages/speech';
import { Mic } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'


// 状态变量
const router = useRouter()
const route = useRoute()
const isInterviewing = ref(false)
const isCameraReady = ref(false)
const isAiThinking = ref(false)
const cameraStatusText = ref('正在请求摄像头权限...')

// DOM 引用
const videoRef = ref<HTMLVideoElement | null>(null)
const chatWindowRef = ref<HTMLDivElement | null>(null)

// 聊天消息类型
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
const chatHistory = ref<ChatMessage[]>([])

// 媒体流
let mediaStream: MediaStream | null = null

// 表情分析结果类型
interface ExpressionResult {
  emotion: string
  confidence: number
  isFace: boolean
}
const expressionResult = ref<ExpressionResult | null>(null)

// 新增状态变量
const isRecording = ref(false);
let websocket: WebSocket | null = null;
let recorderControls: ReturnType<typeof createRecorder> | null = null;

// 初始化语音识别
const initSpeechRecognition = () => {
  // 创建录音控制器
  recorderControls = createRecorder(sendAudioData);

  // 初始化WebSocket
  initWebSocket();
};

// 初始化WebSocket连接
const initWebSocket = () => {
  websocket = new WebSocket(getWebSocketUrl());

  websocket.onopen = () => {
    console.log('WebSocket连接已建立');
    sendStartParams();
  };

  websocket.onmessage = (event) => {
    const text = processRecognitionResult(event.data);
    if (text) {
      updateTranscript(text);
    }
  };

  websocket.onerror = (error) => {
    console.error('WebSocket错误:', error);
    ElMessage.error('语音识别连接错误');
  };

  websocket.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
};

// 发送开始参数
const sendStartParams = () => {
  if (!websocket) return;

  const params = {
    common: {
      app_id: "a006ee60", // 替换为你的APPID
    },
    business: {
      language: "zh_cn",
      domain: "iat",
      accent: "mandarin",
      vad_eos: 5000,
      dwa: "wpgs",
    },
    data: {
      status: 0,
      format: "audio/L16;rate=16000",
      encoding: "raw",
    },
  };

  websocket.send(JSON.stringify(params));
};

// 发送音频数据
const sendAudioData = async (blob: Blob) => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) return;

  const arrayBuffer = await blob.arrayBuffer();
  websocket.send(JSON.stringify({
    data: {
      status: 1,
      format: "audio/L16;rate=16000",
      encoding: "raw",
      audio: arrayBufferToBase64(arrayBuffer),
    },
  }));
};

// 更新转录文本
const updateTranscript = (text: string) => {
  const lastMessage = chatHistory.value[chatHistory.value.length - 1];

  if (lastMessage && lastMessage.role === 'user') {
    lastMessage.content = text;
  } else {
    chatHistory.value.push({
      role: 'user',
      content: text
    });
  }

  scrollToBottom();
};

// 图片压缩函数
const compressImage = async (blob: Blob, maxWidth = 800, quality = 0.7): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // 计算压缩比例
        const scale = Math.min(maxWidth / img.width, 1)
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // 绘制压缩图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 转换为Blob
        canvas.toBlob((compressedBlob) => {
          resolve(compressedBlob || blob) // 如果压缩失败返回原图
        }, 'image/jpeg', quality)
      }
    }

    reader.readAsDataURL(blob)
  })
}

// 捕获并分析表情（只执行一次）
const captureAndAnalyzeOnce = async (): Promise<void> => {
  if (!videoRef.value) return

  try {
    // 创建画布
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法获取画布上下文')

    // 捕获视频帧
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)

    // 获取原始图片Blob
    const originalBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1.0)
    })

    if (!originalBlob) throw new Error('无法生成图片')

    // 压缩图片
    const compressedBlob = await compressImage(originalBlob)
    console.log(`图片压缩: ${(originalBlob.size/1024).toFixed(1)}KB → ${(compressedBlob.size/1024).toFixed(1)}KB`)

    // 发送分析请求
    const result = await analyzeExpression(compressedBlob)
    expressionResult.value = result

    if (!result.isFace) {
      ElMessage.warning('未检测到有效人脸，请正对摄像头')
    } else {
      ElMessage.success(`表情识别: ${result.emotion} (置信度: ${(result.confidence * 100).toFixed(1)}%)`)
    }
  } catch (error) {
    console.error('表情分析失败:', error)
    ElMessage.error('表情分析失败: ' + (error as Error).message)
  }
}

// 获取表情标签类型
const getEmotionTagType = (emotion: string): string => {
  const typeMap: Record<string, string> = {
    '喜悦': 'success',    // 绿色
    '愤怒': 'danger',     // 红色
    '悲伤': 'warning',    // 黄色
    '惊恐': 'info',       // 蓝色
    '厌恶': 'danger',     // 红色
    '中性': '',           // 灰色（默认）
    '非人脸': 'info',     // 蓝色
    '其他表情': ''        // 灰色
  }
  return typeMap[emotion] || ''
}

// 启动摄像头
const startCamera = async (): Promise<void> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatusText.value = "您的浏览器不支持摄像头功能"
    ElMessage.error("浏览器不支持摄像头功能")
    return
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      isCameraReady.value = true
      cameraStatusText.value = ''
    }
  } catch (err) {
    console.error("无法访问摄像头或麦克风:", err)
    cameraStatusText.value = "无法访问摄像头，请检查权限"
    ElMessage.error("无法访问摄像头或麦克风，请检查系统设置或浏览器权限")
  }
  if (route.query.autoStart === 'true') {
    startInterviewProcess();
  }
}

const startInterviewProcess = async () => {
  if (!isCameraReady.value) {
    ElMessage.warning('请先允许摄像头和麦克风权限');
    return;
  }

  try {
    // 检查麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());

    isInterviewing.value = true;
    chatHistory.value = [];
    expressionResult.value = null;
    resetRecognitionResult();

    // 初始化语音识别
    initSpeechRecognition();

    // 开始录音
    recorderControls?.recStart();
    isRecording.value = true;

    ElMessage.success('面试开始！');

    // 10秒后执行表情识别
    setTimeout(captureAndAnalyzeOnce, 10000);

    // AI开场提问
    setTimeout(() => askAiQuestion("你好，欢迎参加本次模拟面试。请先做一个简单的自我介绍吧。"), 500);

  } catch (error) {
    ElMessage.error('无法启动语音识别: ' + (error as Error).message);
  }
};

// 停止摄像头
const stopCamera = (): void => {
  mediaStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop())
  isCameraReady.value = false
}

// 滚动到底部
const scrollToBottom = (): void => {
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTo({
        top: chatWindowRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

// AI提问
const askAiQuestion = (question: string): void => {
  chatHistory.value.push({ role: 'assistant', content: question })
  scrollToBottom()
}


// // 修改后的开始面试
// const startInterview = async (): Promise<void> => {
//   if (!isCameraReady.value) {
//     ElMessage.warning('请先允许摄像头和麦克风权限');
//     return;
//   }

//   try {
//     // 检查麦克风权限
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     stream.getTracks().forEach(track => track.stop());

//     isInterviewing.value = true;
//     chatHistory.value = [];
//     expressionResult.value = null;
//     resetRecognitionResult();

//     // 初始化语音识别
//     initSpeechRecognition();

//     // 开始录音
//     recorderControls?.recStart();
//     isRecording.value = true;

//     ElMessage.success('面试开始！');

//     // 10秒后执行表情识别
//     setTimeout(captureAndAnalyzeOnce, 10000);

//     // AI开场提问
//     setTimeout(() => askAiQuestion("你好，欢迎参加本次模拟面试。请先做一个简单的自我介绍吧。"), 500);

//   } catch (error) {
//     ElMessage.error('无法启动语音识别: ' + (error as Error).message);
//   }
// };
const startInterview = () => {
  router.push('/interview/create')
}

// 修改后的结束面试
const endInterview = (): void => {
  isInterviewing.value = false;
  isRecording.value = false;

  // 停止录音
  recorderControls?.recStop();

  // 关闭WebSocket
  if (websocket) {
    websocket.send(JSON.stringify({
      data: {
        status: 2,
        format: "audio/L16;rate=16000",
        encoding: "raw",
        audio: '',
      },
    }));
    websocket.close();
  }

  ElMessage.info('面试已结束。');
};

// 生命周期钩子
onMounted(startCamera)
onUnmounted(() => {
  stopCamera();
  endInterview(); // 确保清理所有资源
});
</script>

<style scoped>
.interview-page-container {
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.video-panel {
  flex: 6;
  display: flex;
}

.chat-panel {
  flex: 4;
  display: flex;
}

.video-card, .chat-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--el-border-color);
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-card__body) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
}

.expression-result {
  margin-left: auto;
}

.video-wrapper {
  flex-grow: 1;
  background-color: #1a1a1a;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 20px;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  position: absolute;
  color: #888;
  text-align: center;
}

.video-placeholder p {
  margin-top: 10px;
}

.controls {
  margin: 20px;
  text-align: center;
  flex-shrink: 0;
}

/* Chat Window Styles */
.chat-window {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
}

.message-wrapper {
  margin-bottom: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  align-items: center;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message.assistant {
  margin-right: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #eee;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bubble {
  position: relative;
  max-width: calc(100% - 60px);
  min-width: 60px;
  margin-top: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  padding: 12px 16px;
  border-radius: 18px;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.message.user .content {
  background-color: #95ec69;
  color: #000;
  border-radius: 18px 4px 18px 18px;
}

.message.assistant .content {
  background-color: #fff;
  color: #000;
  border-radius: 4px 18px 18px 18px;
  border: 1px solid #eee;
}

/* Arrow for speech bubble */
.arrow {
  position: absolute;
  width: 0;
  height: 0;
  bottom: 12px;
}

.message.user .arrow {
  right: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #95ec69;
}

.message.assistant .arrow {
  left: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 8px solid #fff;
}

/* Thinking animation */
.content.thinking {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  padding: 12px 16px 12px 0;
}

.content.thinking .dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  margin: 0 4px;
  animation: thinking-dots 1.4s infinite ease-in-out both;
}

.content.thinking .dot:nth-child(1) { animation-delay: -0.32s; }
.content.thinking .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes thinking-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

.message-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 4px 0 16px;
  padding: 0 50px;
}

.chat-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color);
  background-color: #fff;
}

.voice-tip {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recording-icon {
  color: var(--el-color-danger);
  margin-right: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Scrollbar styling */
.chat-window::-webkit-scrollbar {
  width: 6px;
}

.chat-window::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-window::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-window::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
