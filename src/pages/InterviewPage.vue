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
          <el-button
            v-if="!isInterviewing"
            type="success"
            size="large"
            @click="startInterview"
            :icon="VideoPlay"
          >
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
        <!-- 在聊天窗口下方添加数字人视频 -->
        <div class="digital-human-video-container">
          <div class="video-wrapper">
            <video
              ref="digitalHumanVideo"
              :src="currentVideoSrc"
              autoplay
              playsinline
              @canplay="onDigitalHumanVideoReady"
              @error="onDigitalHumanVideoError"
              @ended="handleVideoEnded"
            ></video>
            <div v-if="!isDigitalHumanVideoReady" class="video-loading">
              <el-icon class="is-loading" :size="30"><Loading /></el-icon>
              <p>{{ videoLoadingText }}</p>
            </div>
          </div>
        </div>
        <div class="chat-window" ref="chatWindowRef">
          <div v-for="(message, index) in chatHistory" :key="index" class="message-wrapper">
            <div :class="['message', message.role]">
              <div class="avatar">
                <img
                  v-if="message.role === 'user'"
                  src="@/assets/images/user-avatar.png"
                  alt="用户"
                />
                <img v-else src="@/assets/images/ai-avatar.png" alt="AI" />
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
                <img src="@/assets/images/ai-avatar.png" alt="AI" />
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
          <!-- 文本输入框 -->
          <el-input
            v-model="userInputText"
            type="textarea"
            :rows="2"
            placeholder="请输入回答内容或点击右侧麦克风语音输入"
            resize="none"
            @keyup.enter="handleTextSend"
            class="input-textarea"
          />

          <!-- 独立添加操作按钮 -->
          <div class="action-buttons">
            <el-tooltip :content="isRecording ? '停止录音' : '开始录音'">
              <el-button
                @click="toggleVoiceInput"
                :type="isRecording ? 'danger' : 'primary'"
                circle
                class="voice-btn"
              >
                <el-icon><Mic /></el-icon>
              </el-button>
            </el-tooltip>

            <el-button type="primary" @click="handleTextSend" class="send-btn"> 发送 </el-button>
          </div>

          <!-- 录音状态提示 -->
          <div v-if="isRecording" class="recording-status">
            <el-icon class="recording-icon"><Mic /></el-icon>
            <span>正在录音中... ({{ recordingDuration }}秒)</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 面试结束弹窗 -->
    <el-dialog
      v-model="isInterviewEndDialogVisible"
      title="面试结束"
      width="500px"
      :show-close="false"
      :modal="true"
    >
      <div class="dialog-content">
        <p>恭喜您完成所有面试问题！</p>
        <p>面试官会根据您的表现进行综合评估。</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- 右下角的评估按钮 -->
          <el-button type="primary" @click="handleStartEvaluation" class="evaluation-btn">
            开始评估
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { VideoPlay, VideoPause, CameraFilled, Loading } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { analyzeExpression } from "@/api/interview";
import { createRecorder } from "@/pages/recoder";
import {
  getWebSocketUrl,
  arrayBufferToBase64,
  processRecognitionResult,
  resetRecognitionResult,
} from "@/pages/speech";
import { Mic } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import video1 from "@/assets/video/1.mp4";
import video2 from "@/assets/video/2.mp4";
import video3 from "@/assets/video/3.mp4";
import video4 from "@/assets/video/4.mp4";
import video5 from "@/assets/video/5.mp4";

// 状态变量
const router = useRouter();
const route = useRoute();
const userInputText = ref("");
const recordingDuration = ref(0);
let recordingTimer: ReturnType<typeof setInterval> | null = null;
const isInterviewing = ref(false);
const isCameraReady = ref(false);
const isAiThinking = ref(false);
const cameraStatusText = ref("正在请求摄像头权限...");

// DOM 引用
const videoRef = ref<HTMLVideoElement | null>(null);
const chatWindowRef = ref<HTMLDivElement | null>(null);
const isInterviewEndDialogVisible = ref(false);

// 聊天消息类型
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
const chatHistory = ref<ChatMessage[]>([]);

// 媒体流
let mediaStream: MediaStream | null = null;

// 表情分析结果类型
interface ExpressionResult {
  emotion: string;
  confidence: number;
  isFace: boolean;
}
const expressionResult = ref<ExpressionResult | null>(null);

// 新增状态变量
const isRecording = ref(false);
let websocket: WebSocket | null = null;
let recorderControls: ReturnType<typeof createRecorder> | null = null;

const isDigitalHumanVideoReady = ref(false);
const videoLoadingText = ref("AI面试官加载中...");
const digitalHumanVideo = ref<HTMLVideoElement | null>(null);
const currentQuestionIndex = ref(0); // 当前问题索引

const questions = [
  {
    text: "您好！我是今天的面试官，负责这次Java后端开发工程师的招聘。很高兴见到您，感谢您抽出宝贵的时间来参加这次面试。首先，我需要了解一下您的基本信息。请您简单介绍一下自己。", // 替换为你的第一个问题
    videoSrc: video1, // 替换为你的第一个视频路径
  },
  {
    text: "好的，许战同学。接下来，我想了解一下您在Java后端开发方面的基础知识和技能。请您谈谈您对Spring框架的理解以及它的主要特点和应用。", // 替换为你的第二个问题
    videoSrc: video2, // 替换为你的第二个视频路径
  },
  {
    text: "好的，许战同学。您对Spring框架的理解很全面。接下来，我想了解一下您在项目开发中遇到的一个技术难题以及您是如何解决的。请您谈谈在校园论坛后端开发项目中，您是如何优化数据库查询性能的？", // 替换为你的第三个问题
    videoSrc: video3, // 替换为你的第三个视频路径
  },
  {
    text: "好的，许战同学。您在优化数据库查询性能方面做得非常出色。接下来，我想了解一下您在实际项目中是如何进行代码重构和优化的。请您谈谈在校园论坛后端开发项目中，您是如何对一个复杂模块进行代码重构以提高其可读性和可维护性的？", // 替换为你的第四个问题
    videoSrc: video4, // 替换为你的第四个视频路径
  },
  {
    text: "今天的面试结束了，感谢你的到来，后续面试结果我们会统一通过邮件通知，大概在5天左右，请留意查看。祝你求职顺利！", // 替换为你的第五个问题
    videoSrc: video5, // 替换为你的第五个视频路径
  },
];
const currentVideoSrc = ref(questions[0].videoSrc); // 初始化为第一个视频

// 语音输入开关
const toggleVoiceInput = () => {
  if (isRecording.value) {
    // 停止录音
    recorderControls?.recStop();
    clearTimer();
  } else {
    // 开始录音
    isRecording.value = true;
    recordingDuration.value = 0;
    recordingTimer = setInterval(() => {
      recordingDuration.value++;
    }, 1000);
    recorderControls?.recStart();
  }
};

// 清除计时器
const clearTimer = () => {
  if (recordingTimer) {
    clearInterval(recordingTimer);
    recordingTimer = null;
  }
  isRecording.value = false;
};

// 更新识别结果到文本框
const updateTranscript = (text: string) => {
  userInputText.value = text;
};

const handleTextSend = () => {
  if (!userInputText.value.trim()) return;

  // 添加用户回答到聊天记录
  chatHistory.value.push({
    role: "user",
    content: userInputText.value,
    time: new Date().toLocaleTimeString()
  });
  userInputText.value = "";
  scrollToBottom();

  // 判断是否是最后一个问题（索引为4，因为数组从0开始）
  if (currentQuestionIndex.value === questions.length - 1) {
    // 最后一个问题回答后，显示结束弹窗
    setTimeout(() => {
      isInterviewEndDialogVisible.value = true; // 显示弹窗
      isInterviewing.value = false;
    }, 1000);
  } else {
    // 非最后一个问题，切换到下一个
    isAiThinking.value = true;
    setTimeout(() => {
      currentQuestionIndex.value++;
      playCurrentQuestion();
      isAiThinking.value = false;
    }, 1500);
  }
};

// 新增：点击开始评估的处理函数
const handleStartEvaluation = () => {
  isInterviewEndDialogVisible.value = false; // 关闭弹窗
  // 这里可以添加评估逻辑，例如跳转到评估页面
  ElMessage.success("开始评估");
  // 示例：路由跳转（如果需要）
  // router.push("/interview/evaluation");
};

const onDigitalHumanVideoReady = () => {
  isDigitalHumanVideoReady.value = true;
};

const onDigitalHumanVideoError = () => {
  console.error("数字人视频加载失败", digitalHumanVideo.value?.error);
  videoLoadingText.value = `视频加载失败: ${digitalHumanVideo.value?.error?.message || "未知错误"}`;
  isDigitalHumanVideoReady.value = false;
};

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
    console.log("WebSocket连接已建立");
    sendStartParams();
  };

  websocket.onmessage = (event) => {
    const text = processRecognitionResult(event.data);
    if (text) {
      updateTranscript(text);
    }
  };

  websocket.onerror = (error) => {
    console.error("WebSocket错误:", error);
    ElMessage.error("语音识别连接错误");
  };

  websocket.onclose = () => {
    console.log("WebSocket连接已关闭");
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
  websocket.send(
    JSON.stringify({
      data: {
        status: 1,
        format: "audio/L16;rate=16000",
        encoding: "raw",
        audio: arrayBufferToBase64(arrayBuffer),
      },
    })
  );
};

// 图片压缩函数
const compressImage = async (blob: Blob, maxWidth = 800, quality = 0.7): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // 计算压缩比例
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // 绘制压缩图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 转换为Blob
        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob || blob); // 如果压缩失败返回原图
          },
          "image/jpeg",
          quality
        );
      };
    };

    reader.readAsDataURL(blob);
  });
};

// 捕获并分析表情（只执行一次）
const captureAndAnalyzeOnce = async (): Promise<void> => {
  if (!videoRef.value) return;

  try {
    // 创建画布
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法获取画布上下文");

    // 捕获视频帧
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);

    // 获取原始图片Blob
    const originalBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 1.0);
    });

    if (!originalBlob) throw new Error("无法生成图片");

    // 压缩图片
    const compressedBlob = await compressImage(originalBlob);
    console.log(
      `图片压缩: ${(originalBlob.size / 1024).toFixed(1)}KB → ${(
        compressedBlob.size / 1024
      ).toFixed(1)}KB`
    );

    // 发送分析请求
    const result = await analyzeExpression(compressedBlob);
    expressionResult.value = result;

    if (!result.isFace) {
      ElMessage.warning("未检测到有效人脸，请正对摄像头");
    } else {
      ElMessage.success(
        `表情识别: ${result.emotion} (置信度: ${(result.confidence * 100).toFixed(1)}%)`
      );
    }
  } catch (error) {
    console.error("表情分析失败:", error);
    ElMessage.error("表情分析失败: " + (error as Error).message);
  }
};

// 获取表情标签类型
const getEmotionTagType = (emotion: string): string => {
  const typeMap: Record<string, string> = {
    喜悦: "success", // 绿色
    愤怒: "danger", // 红色
    悲伤: "warning", // 黄色
    惊恐: "info", // 蓝色
    厌恶: "danger", // 红色
    中性: "", // 灰色（默认）
    非人脸: "info", // 蓝色
    其他表情: "", // 灰色
  };
  return typeMap[emotion] || "";
};

// 启动摄像头
const startCamera = async (): Promise<void> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraStatusText.value = "您的浏览器不支持摄像头功能";
    ElMessage.error("浏览器不支持摄像头功能");
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      isCameraReady.value = true;
      cameraStatusText.value = "";
    }
  } catch (err) {
    console.error("无法访问摄像头或麦克风:", err);
    cameraStatusText.value = "无法访问摄像头，请检查权限";
    ElMessage.error("无法访问摄像头或麦克风，请检查系统设置或浏览器权限");
  }
  if (route.query.autoStart === "true") {
    startInterviewProcess();
  }
};

const startInterviewProcess = async () => {
  if (!isCameraReady.value) {
    ElMessage.warning("请先允许摄像头和麦克风权限");
    return;
  }

  try {
    // 检查麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());

    isInterviewing.value = true;
    chatHistory.value = [];
    expressionResult.value = null;
    resetRecognitionResult();

    // 初始化语音识别
    initSpeechRecognition();

    // 开始录音
    // recorderControls?.recStart();
    // isRecording.value = true;

    ElMessage.success("面试开始！");

    // 10秒后执行表情识别
    setTimeout(captureAndAnalyzeOnce, 10000);
  } catch (error) {
    ElMessage.error("无法启动语音识别: " + (error as Error).message);
  }
  currentQuestionIndex.value = 0; // 重置为第一个问题
  playCurrentQuestion(); // 播放第一个视频和问题
};

// 停止摄像头
const stopCamera = (): void => {
  mediaStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  isCameraReady.value = false;
};

// 滚动到底部
const scrollToBottom = (): void => {
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTo({
        top: chatWindowRef.value.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

// AI提问
const askAiQuestion = (question: string): void => {
  chatHistory.value.push({ role: "assistant", content: question });
  scrollToBottom();
};

const handleVideoEnded = () => {
  console.log("当前视频播放结束");
  // 可添加视频播放完后的逻辑（如自动显示问题文本）
};

// 新增播放当前问题的核心函数
const playCurrentQuestion = () => {
  const current = questions[currentQuestionIndex.value];
  currentVideoSrc.value = current.videoSrc; // 更新视频源
  isDigitalHumanVideoReady.value = false;
  videoLoadingText.value = `加载第${currentQuestionIndex.value + 1}个问题视频...`;

  // 重新加载并播放视频
  if (digitalHumanVideo.value) {
    digitalHumanVideo.value.load();
    digitalHumanVideo.value.play().catch((err) => {
      console.error("视频播放失败:", err);
    });
  }

  // 添加问题到聊天记录
  chatHistory.value.push({
    role: "assistant",
    content: current.text,
    time: new Date().toLocaleTimeString(),
  });
  scrollToBottom();
};

const startInterview = () => {
  router.push("/interview/create");
};

// 修改后的结束面试
const endInterview = (): void => {
  isInterviewing.value = false;
  isRecording.value = false;

  // 停止录音
  recorderControls?.recStop();

  // 关闭WebSocket
  if (websocket) {
    websocket.send(
      JSON.stringify({
        data: {
          status: 2,
          format: "audio/L16;rate=16000",
          encoding: "raw",
          audio: "",
        },
      })
    );
    websocket.close();
  }

  ElMessage.info("面试已结束。");
};

// 生命周期钩子
onMounted(startCamera);
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
  flex: 5;
  display: flex;
}

.chat-panel {
  flex: 5;
  display: flex;
}

.video-card,
.chat-card {
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

.content.thinking .dot:nth-child(1) {
  animation-delay: -0.32s;
}
.content.thinking .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes thinking-dots {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.message-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 4px 0 16px;
  padding: 0 50px;
}

.chat-input-area {
  padding: 16px;
  background: #fff;
  border-top: 1px solid var(--el-border-color);
  position: relative;
}

/* 输入框样式 */
.input-textarea {
  margin-bottom: 10px;
}

/* 按钮容器 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 语音按钮样式 */
.voice-btn {
  font-size: 18px;
  transition: all 0.3s;
}

/* 录音状态提示 */
.recording-status {
  display: flex;
  align-items: center;
  margin-top: 8px;
  color: var(--el-color-danger);
  font-size: 14px;
}

.recording-icon {
  margin-right: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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
.digital-human-video-container {
  padding: 0 16px 16px;
  margin-top: auto;
}

.digital-human-video-container .video-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color);
}

.digital-human-video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.video-loading {
  position: absolute;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.video-loading p {
  margin-top: 10px;
}
/* 数字人视频容器 */
.digital-human-video-container {
  padding: 0 16px 16px;
  margin-top: auto;
  background-color: #f5f7fa; /* 添加与界面协调的背景色 */
}

.digital-human-video-container .video-wrapper {
  position: relative;
  width: 100%;
  height: 400px; /* 固定高度 */
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000; /* 容器背景色 */
}

.digital-human-video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 填充容器，可能会裁剪 */
  /* 或者使用以下方式保持比例但填充背景 */
  /*
  width: auto;
  height: 100%;
  max-width: 100%;
  */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .digital-human-video-container .video-wrapper {
    height: 150px;
  }
}
:deep(.el-input-group__append) {
  border: 1px solid red; /* 调试用 */
}

/* 面试结束弹窗样式 */
.dialog-content {
  padding: 20px 0;
  font-size: 16px;
  line-height: 1.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end; /* 按钮靠右显示 */
}

.evaluation-btn {
  background-color: #409eff;
  color: white;
}

/* 弹窗样式优化 */
:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  padding: 15px 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 15px 20px;
  border-top: 1px solid #eee;
}
</style>
