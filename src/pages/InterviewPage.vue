<template>
  <div class="interview-page-container">
    <div class="video-panel">
      <el-card class="video-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>我的视频</span>
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
            开始面试
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
                <span>{{ message.role === 'user' ? '我' : 'AI' }}</span>
              </div>
              <div class="content">
                <p>{{ message.content }}</p>
              </div>
            </div>
          </div>

          <div v-if="isAiThinking" class="message-wrapper">
            <div class="message assistant">
                <div class="avatar"><span>AI</span></div>
                <div class="content thinking">
                  <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
            </div>
          </div>
        </div>
        <div class="chat-input-area">
          <p class="voice-tip">请通过语音回答，系统将自动识别并转为文字</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { VideoPlay, VideoPause, CameraFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isInterviewing = ref(false)
const isCameraReady = ref(false)
const isAiThinking = ref(false)
const cameraStatusText = ref('正在请求摄像头权限...')

const videoRef = ref(null)
const chatWindowRef = ref(null)
const chatHistory = ref([])

let mediaStream = null

const startCamera = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
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
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    isCameraReady.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight
    }
  })
}

const askAiQuestion = (question) => {
  chatHistory.value.push({ role: 'assistant', content: question })
  scrollToBottom()
}

const simulateUserResponse = (text) => {
  chatHistory.value.push({ role: 'user', content: text })
  scrollToBottom()
  isAiThinking.value = true

  setTimeout(() => {
    isAiThinking.value = false
    askAiQuestion("好的，了解了。那你能谈谈你最大的优点是什么吗？")
  }, 2500)
}

const startInterview = () => {
  if (!isCameraReady.value) {
    ElMessage.warning('请先允许摄像头和麦克风权限')
    return
  }
  isInterviewing.value = true
  chatHistory.value = []
  ElMessage.success('面试开始！')

  setTimeout(() => askAiQuestion("你好，欢迎参加本次模拟面试。请先做一个简单的自我介绍吧。"), 500)

  setTimeout(() => simulateUserResponse("面试官你好，我叫李华，毕业于XX大学，主修计算机科学。我非常热爱编程，并且有三年的前端开发经验。"), 5000)
}

const endInterview = () => {
  isInterviewing.value = false
  ElMessage.info('面试已结束。')
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.interview-page-container {
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
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
  border: 1px solid var(--border-color);
}

:deep(.el-card__body) {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
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
  margin-top: 20px;
  text-align: center;
  flex-shrink: 0;
}

.chat-window {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
}
.message-wrapper {
  margin-bottom: 20px;
  display: flex;
}
.message {
  display: flex;
  gap: 12px;
  max-width: 95%;
  align-items: flex-start;
}
.message .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-weight: bold;
}
.message .content {
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
}
.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}
.message.user .avatar {
  background-color: var(--primary-color);
}
.message.user .content {
  background-color: var(--primary-color-light);
  border-radius: 12px 12px 0 12px;
}
.message.assistant {
  margin-right: auto;
}
.message.assistant .avatar {
  background-color: var(--success-color);
}
.message.assistant .content {
  background-color: var(--success-color-light);
  border-radius: 12px 12px 12px 0;
}
.content.thinking .dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #909399;
  margin: 0 2px;
  animation: thinking-dots 1.4s infinite ease-in-out both;
}
.content.thinking .dot:nth-child(1) { animation-delay: -0.32s; }
.content.thinking .dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes thinking-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

.chat-input-area {
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
.voice-tip {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 14px;
}
</style>
