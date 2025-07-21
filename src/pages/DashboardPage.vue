<template>
  <div class="dashboard">
    <!-- 欢迎卡片 - 添加渐变背景和悬浮效果 -->
    <div class="welcome-card">
      <div class="welcome-content">
        <h2>欢迎回来, {{ userName }}</h2>
        <p class="welcome-text">智能面试系统为您提供专业的模拟面试和能力分析服务</p>
        <div class="welcome-stats">
          <div class="stat-item">
            <span class="stat-label">今日面试机会</span>
            <span class="stat-value">3</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">新消息</span>
            <span class="stat-value">2</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作区 - 增强动效和视觉层次 -->
    <div class="quick-actions">
      <el-card shadow="hover" class="action-card" @click="router.push('/resume')">
        <div class="card-icon bg-primary">
          <el-icon size="40"><Upload /></el-icon>
        </div>
        <h3>上传简历</h3>
        <p>上传或更新您的简历</p>
        <div class="card-overlay"></div>
      </el-card>

      <el-card shadow="hover" class="action-card" @click="router.push('/interview')">
        <div class="card-icon bg-secondary">
          <el-icon size="40"><VideoCamera /></el-icon>
        </div>
        <h3>开始面试</h3>
        <p>开始新的模拟面试</p>
        <div class="card-overlay"></div>
      </el-card>

      <el-card shadow="hover" class="action-card" @click="router.push('/analysis')">
        <div class="card-icon bg-tertiary">
          <el-icon size="40"><TrendCharts /></el-icon>
        </div>
        <h3>查看分析</h3>
        <p>查看能力分析报告</p>
        <div class="card-overlay"></div>
      </el-card>
    </div>

    <!-- 数据卡片 - 添加动态效果 -->
    <div class="data-cards">
      <el-card class="data-card">
        <div class="card-header">
          <h3>面试次数</h3>
          <div class="card-value">{{ interviewCount }}</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="65" status="primary"></el-progress>
          <div class="progress-label">较上周 <span class="increase">+12%</span></div>
        </div>
      </el-card>

      <el-card class="data-card">
        <div class="card-header">
          <h3>简历数量</h3>
          <div class="card-value">{{ resumeCount }}</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="80" status="success"></el-progress>
          <div class="progress-label">较上周 <span class="increase">+5%</span></div>
        </div>
      </el-card>

      <el-card class="data-card">
        <div class="card-header">
          <h3>能力评分</h3>
          <div class="card-value">{{ scoreValue }}/100</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="72" status="warning"></el-progress>
          <div class="progress-label">较上周 <span class="increase">+8%</span></div>
        </div>
      </el-card>
    </div>

    <!-- 最近活动 - 美化时间线 -->
    <div class="recent-activities">
      <div class="activities-header">
        <h3>最近活动</h3>
        <el-button type="text" size="small" class="view-all">查看全部</el-button>
      </div>
      <el-timeline class="fixed-timeline">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          :type="activity.type || ''"
          placement="top"
        >
          <el-card class="activity-card">
            <div class="activity-content">{{ activity.content }}</div>
            <div class="activity-meta">
              <span class="activity-type">{{ getActivityType(activity.type) }}</span>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, VideoCamera, TrendCharts } from '@element-plus/icons-vue'
import { getUserProfile } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userName = ref('游客')
const interviewCount = ref(5)
const resumeCount = ref(3)
const scoreValue = ref(72)

// 活动数据
const activities = ref([
  {
    content: '完成了模拟产品经理面试，获得评分85分',
    timestamp: '2025-06-25 14:30',
    type: 'success'
  },
  {
    content: '上传了最新简历「2025-求职简历-优化版」',
    timestamp: '2025-06-10 09:15',
    type: 'primary'
  },
  {
    content: '查看了能力分析报告，查看了改进建议',
    timestamp: '2025-06-05 16:45',
    type: 'info'
  },
  {
    content: '完成了模拟前端开发工程师面试',
    timestamp: '2025-06-01 10:20',
    type: 'success'
  }
])

// 获取活动类型文本
const getActivityType = (type: string) => {
  const types = {
    'success': '面试完成',
    'primary': '简历操作',
    'info': '系统操作'
  }
  return types[type as keyof typeof types] || '活动'
}

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const response = await getUserProfile();
    if (response.data.status === 200 && response.data.success) {
      const userData = response.data.data;
      userName.value = userData.username || '用户';
      // 可以在这里添加更多数据初始化
    } else {
      ElMessage.error(response.data.msg || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败，请稍后重试');
  }
};

onMounted(() => {
  fetchUserProfile();
  
  // 添加数字增长动画效果
  animateValue(interviewCount, 0, 5, 1500);
  animateValue(resumeCount, 0, 3, 1500);
  animateValue(scoreValue, 0, 72, 1500);
});

// 数字增长动画
const animateValue = (ref: any, start: number, end: number, duration: number) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    ref.value = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
}

/* 欢迎卡片样式 */
.welcome-card {
  background: linear-gradient(135deg, #409EFF 0%, #69b1ff 100%);
  border-radius: 12px;
  padding: 30px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.15);
  transition: transform 0.3s ease;
}

.welcome-card:hover {
  transform: translateY(-3px);
}

.welcome-content h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-text {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 20px;
  line-height: 1.6;
}

.welcome-stats {
  display: flex;
  gap: 30px;
  margin-top: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.stat-value::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

/* 快捷操作区样式 */
.quick-actions {
  display: flex;
  gap: 24px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.action-card {
  flex: 1;
  min-width: 240px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.action-card:hover .card-icon {
  transform: scale(1.1);
}

.card-icon {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #ffffff;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.bg-primary {
  background-color: #409EFF;
}

.bg-secondary {
  background-color: #67C23A;
}

.bg-tertiary {
  background-color: #E6A23C;
}

.action-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.action-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-card:hover .card-overlay {
  opacity: 1;
}

/* 数据卡片样式 */
.data-cards {
  display: flex;
  gap: 24px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.data-card {
  flex: 1;
  min-width: 240px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.data-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 0;
}

.card-value {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
  position: relative;
  overflow: hidden;
  height: 40px;
}

.card-progress {
  margin-top: auto;
}

.el-progress {
  height: 8px !important;
}

.el-progress__bar {
  border-radius: 4px !important;
}

.el-progress__inner {
  border-radius: 4px !important;
}

.progress-label {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  font-size: 13px;
}

.increase {
  color: #67C23A;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.increase::before {
  content: '↑';
  font-size: 12px;
  margin-right: 3px;
}

/* 最近活动样式 */
.recent-activities {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.recent-activities h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.view-all {
  color: #409EFF !important;
  padding: 0 !important;
  font-size: 14px !important;
}

.view-all:hover {
  color: #66b1ff !important;
  background-color: transparent !important;
}

.fixed-timeline {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.fixed-timeline::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.fixed-timeline::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
}

.fixed-timeline::-webkit-scrollbar-track {
  background: transparent;
}

.el-timeline {
  padding-left: 20px !important;
}

.el-timeline-item {
  padding-bottom: 20px !important;
}

.el-timeline-item__timestamp {
  font-size: 13px !important;
  color: #909399 !important;
  margin-bottom: 8px !important;
  font-weight: 400 !important;
}

.activity-card {
  border: none !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05) !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

.activity-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transform: translateX(3px);
}

.activity-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.activity-meta {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.activity-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

/* 活动类型样式 */
.activity-type.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.activity-type.primary {
  background-color: #ecf5ff;
  color: #409eff;
}

.activity-type.info {
  background-color: #f0f2f5;
  color: #909399;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card, .action-card, .data-card, .recent-activities {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.welcome-card { animation-delay: 0.1s; }
.action-card:nth-child(1) { animation-delay: 0.2s; }
.action-card:nth-child(2) { animation-delay: 0.3s; }
.action-card:nth-child(3) { animation-delay: 0.4s; }
.data-card:nth-child(1) { animation-delay: 0.5s; }
.data-card:nth-child(2) { animation-delay: 0.6s; }
.data-card:nth-child(3) { animation-delay: 0.7s; }
.recent-activities { animation-delay: 0.8s; }
</style>