<template>
  <div class="resume-opt-container">
    <div class="header-actions">
      <h1 class="page-title">简历智能优化</h1>
      <div class="action-buttons">
        <el-button size="large" :icon="Upload">上传简历文件</el-button>
        <el-button
          type="primary"
          size="large"
          :icon="MagicStick"
          @click="handleAnalyze"
          :loading="isLoading"
        >
          {{ isLoading ? '分析中...' : '开始智能分析' }}
        </el-button>
      </div>
    </div>

    <div class="main-content">
      <div class="editor-panel">
        <el-card shadow="never" class="editor-card">
          <template #header>
            <div class="card-header">
              <span>简历内容</span>
              <el-button text :icon="DocumentCopy">复制内容</el-button>
            </div>
          </template>
          <textarea v-model="resumeText" class="resume-textarea" placeholder="请在此处粘贴或输入您的简历内容..."></textarea>
        </el-card>
      </div>

      <div class="analysis-panel">
        <el-card shadow="never" class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>AI 分析报告</span>
            </div>
          </template>

          <div v-if="!analysisResult" class="placeholder">
            <el-icon><DataLine /></el-icon>
            <p>点击“开始智能分析”<br/>获取您的专属优化报告</p>
          </div>

          <div v-if="analysisResult" class="result-container">
            <div class="summary-score">
              <el-progress type="dashboard" :percentage="analysisResult.overallScore" :width="140" :color="progressColors">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}</span>
                  <span class="percentage-label">综合得分</span>
                </template>
              </el-progress>
              <p class="summary-comment">{{ analysisResult.summaryComment }}</p>
            </div>

            <div class="feedback-list">
              <el-card v-for="item in analysisResult.feedbackItems" :key="item.title" class="feedback-card" shadow="hover">
                <div class="feedback-header">
                  <el-icon :size="20" class="feedback-icon" :color="item.iconColor"><component :is="item.icon" /></el-icon>
                  <h4>{{ item.title }}</h4>
                  <span class="feedback-score">{{ item.score }}/100</span>
                </div>
                <p class="feedback-suggestion">{{ item.suggestion }}</p>
              </el-card>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Upload,
  MagicStick,
  DocumentCopy,
  DataLine,
  Search,
  EditPen,
  TrendCharts
} from '@element-plus/icons-vue';

// --- Reactive State ---

const isLoading = ref(false);
const resumeText = ref(
`张三

求职意向：前端开发工程师

教育背景
2021.09 - 2025.06  某某大学  计算机科学与技术（本科）

项目经历
1. 个人博客网站
   - 介绍：一个个人项目，用于分享技术文章。
   - 技术：使用了Vue和Node.js。
   - 职责：我负责了所有工作。

2. 电商平台
   - 介绍：一个模拟的电商平台。
   - 技术：React, Redux。
   - 职责：开发了几个页面。`
);

const analysisResult = ref(null as AnalysisResult | null);

interface AnalysisResult {
  overallScore: number;
  summaryComment: string;
  feedbackItems: FeedbackItem[];
}

interface FeedbackItem {
  icon: any;
  iconColor: string;
  title: string;
  score: number;
  suggestion: string;
}

// --- Mock Data & Methods ---

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];

const handleAnalyze = () => {
  isLoading.value = true;
  analysisResult.value = null;

  // Simulate API call
  setTimeout(() => {
    analysisResult.value = {
      overallScore: 85,
      summaryComment: '简历整体竞争力良好，部分项目描述可进一步优化，以量化成果来突出贡献。',
      feedbackItems: [
        {
          icon: Search,
          iconColor: '#2d8cf0',
          title: '关键词匹配度',
          score: 88,
          suggestion: '与目标岗位相关的关键词如 "Vite"、"Webpack"、"性能优化" 等出现频率较高，匹配度良好。'
        },
        {
          icon: EditPen,
          iconColor: '#19be6b',
          title: '行为动词使用',
          score: 78,
          suggestion: '建议将 "我负责了"、"开发了几个页面" 等模糊描述替换为 "主导开发"、"独立实现"、"优化了" 等强有力的动词。'
        },
        {
          icon: TrendCharts,
          iconColor: '#ff9900',
          title: '量化成果表达',
          score: 72,
          suggestion: '项目经历中缺少量化成果。例如，可以将 "提升了效率" 具体为 "通过代码重构，使页面加载速度提升了30%"。'
        }
      ]
    };
    isLoading.value = false;
  }, 2000);
}
</script>

<style scoped>
/* --- 整体布局与背景 --- */
.resume-opt-container {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  color: #333;
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}

/* --- 顶部操作栏 --- */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.action-buttons .el-button {
  font-weight: 500;
}

/* --- 主内容区 --- */
.main-content {
  display: flex;
  gap: 24px;
}

.editor-panel {
  flex: 1;
  min-width: 0;
}

.analysis-panel {
  flex: 1;
  min-width: 0;
}

/* --- 卡片通用样式 --- */
.el-card {
  border: none;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* --- 左侧简历编辑区 --- */
.editor-card, .analysis-card {
  width: 40vw;;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.editor-card .el-card__body, .analysis-card .el-card__body {
  flex-grow: 1;
  overflow-y: auto;
}

.resume-textarea {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.resume-textarea:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

/* --- 右侧AI分析区 --- */
.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
  text-align: center;
}

.placeholder .el-icon {
  font-size: 64px;
}

.placeholder p {
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.result-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.summary-score {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #e4e7ed;
}

.percentage-value {
  display: block;
  font-size: 36px;
  font-weight: 600;
  color: #303133;
}

.percentage-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.summary-comment {
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.feedback-list {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-card {
  border-radius: 8px;
  transition: box-shadow 0.3s, border-color 0.3s;
}

.feedback-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-icon {
  margin-right: 12px;
}

.feedback-header h4 {
  flex-grow: 1;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.feedback-score {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.feedback-suggestion {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
}
</style>
