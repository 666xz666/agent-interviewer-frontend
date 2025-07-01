<template>
  <div class="dashboard">
    <div class="welcome-card">
      <h2>欢迎回来, {{ userName }}</h2>
      <p class="welcome-text">智能面试系统为您提供专业的模拟面试和能力分析服务</p>
    </div>

    <div class="quick-actions">
      <el-card shadow="hover" class="action-card" @click="router.push('/resume')">
        <div class="card-icon bg-primary">
          <el-icon size="40"><Upload /></el-icon>
        </div>
        <h3>上传简历</h3>
        <p>上传或更新您的简历</p>
      </el-card>

      <el-card shadow="hover" class="action-card" @click="router.push('/interview')">
        <div class="card-icon bg-secondary">
          <el-icon size="40"><VideoCamera /></el-icon>
        </div>
        <h3>开始面试</h3>
        <p>开始新的模拟面试</p>
      </el-card>

      <el-card shadow="hover" class="action-card" @click="router.push('/analysis')">
        <div class="card-icon bg-tertiary">
          <el-icon size="40"><TrendCharts /></el-icon>
        </div>
        <h3>查看分析</h3>
        <p>查看能力分析报告</p>
      </el-card>
    </div>

    <div class="data-cards">
      <el-card class="data-card">
        <div class="card-header">
          <h3>面试次数</h3>
          <div class="card-value">{{ interviewCount }}</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="65" status="primary"></el-progress>
        </div>
      </el-card>

      <el-card class="data-card">
        <div class="card-header">
          <h3>简历数量</h3>
          <div class="card-value">{{ resumeCount }}</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="80" status="success"></el-progress>
        </div>
      </el-card>

      <el-card class="data-card">
        <div class="card-header">
          <h3>能力评分</h3>
          <div class="card-value">{{ scoreValue }}/100</div>
        </div>
        <div class="card-progress">
          <el-progress :percentage="72" status="warning"></el-progress>
        </div>
      </el-card>
    </div>

    <div class="recent-activities">
      <h3>最近活动</h3>
      <el-timeline class="fixed-timeline">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          :type="activity.type || ''"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, VideoCamera, TrendCharts } from '@element-plus/icons-vue'

const router = useRouter()
const userName = ref('游客')
const interviewCount = ref(5)
const resumeCount = ref(3)
const scoreValue = ref(72)

const activities = ref([
  {
    content: '完成了模拟产品经理面试',
    timestamp: '2023-05-15',
    type: 'success'
  },
  {
    content: '上传了最新简历',
    timestamp: '2023-05-10',
    type: 'primary'
  },
  {
    content: '查看了能力分析报告',
    timestamp: '2023-05-05',
    type: 'info'
  }
])
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.welcome-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.welcome-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.welcome-text {
  color: #606266;
  font-size: 16px;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-card {
  flex: 1;
  min-width: 240px;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #ffffff;
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
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.action-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.data-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.data-card {
  flex: 1;
  min-width: 240px;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.card-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.card-progress {
  margin-top: auto;
}

.recent-activities {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recent-activities h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.fixed-timeline {
  flex: 1;
  overflow-y: auto;
}
</style>
