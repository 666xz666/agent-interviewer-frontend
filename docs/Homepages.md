
简历列表：展示简历，编辑按钮。


<template>
  <div class="main-layout">
    <!-- 左侧导航栏 - 更现代化设计 -->
    <div class="app-sidebar">
      <div class="sidebar-header">
        <div class="app-logo">
          <svg viewBox="0 0 24 24" width="24" height="24" class="logo-icon">
            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
          </svg>
          <span class="app-name">AI Interview Pro</span>
        </div>
      </div>

      <div class="sidebar-menu">
        <div
          v-for="item in menuItems"
          :key="item.id"
          :class="['menu-item', { 'active': activeMenu === item.id }]"
          @click="handleMenuSelect(item.id)"
        >
          <component :is="item.icon" class="menu-icon" />
          <span class="menu-text">{{ item.name }}</span>
          <div v-if="activeMenu === item.id" class="active-indicator"></div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-profile">
          <el-avatar :size="36" :src="userAvatar" />
          <div class="user-info">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">Premium Member</div>
          </div>
          <el-dropdown>
            <el-icon class="user-dropdown"><More /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主内容区域 - 全屏设计 -->
    <div class="app-content">
      <!-- 顶部工具栏 -->
      <div class="content-toolbar">
        <div class="toolbar-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索..."
            class="search-input"
            :prefix-icon="Search"
          />
          <el-button type="primary" round class="new-interview-btn" @click="startNewInterview">
            <template #icon>
              <VideoCamera />
            </template>
            开始新面试
          </el-button>
        </div>
      </div>

      <!-- 动态内容区域 -->
      <div class="content-main">
        <!-- 仪表盘 -->
        <div v-if="activeMenu === 'dashboard'" class="dashboard-page">
          <div class="welcome-banner">
            <div class="welcome-text">
              <h1>欢迎回来, {{ userName }} 👋</h1>
              <p class="subtitle">准备好在今天的模拟面试中提升自己了吗？</p>
            </div>
            <div class="welcome-actions">
              <el-button type="primary" size="large" @click="handleMenuSelect('interview')">
                立即开始面试
              </el-button>
              <el-button size="large" @click="handleMenuSelect('resume')">
                上传简历
              </el-button>
            </div>
          </div>

          <div class="stats-cards">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #e3f2fd;">
                  <Document class="icon" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">3</div>
                  <div class="stat-label">简历数量</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #e8f5e9;">
                  <ChatLineRound class="icon" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">12</div>
                  <div class="stat-label">完成面试</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #fff8e1;">
                  <Star class="icon" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">8.2</div>
                  <div class="stat-label">平均评分</div>
                </div>
              </div>
            </el-card>

            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <div class="stat-icon" style="background-color: #f3e5f5;">
                  <TrendCharts class="icon" />
                </div>
                <div class="stat-info">
                  <div class="stat-value">+15%</div>
                  <div class="stat-label">进步幅度</div>
                </div>
              </div>
            </el-card>
          </div>

          <div class="content-section">
            <div class="section-half">
              <h3 class="section-title">最近活动</h3>
              <el-scrollbar height="300px">
                <div class="activity-list">
                  <div v-for="(activity, index) in activities" :key="index" class="activity-item">
                    <div class="activity-icon">
                      <component :is="activity.icon" />
                    </div>
                    <div class="activity-content">
                      <div class="activity-text">{{ activity.content }}</div>
                      <div class="activity-time">{{ activity.timestamp }}</div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>

            <div class="section-half">
              <h3 class="section-title">面试准备进度</h3>
              <div class="progress-chart">
                <el-progress type="dashboard" :percentage="75" :color="colors">
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ percentage }}%</span>
                    <span class="percentage-label">完成度</span>
                  </template>
                </el-progress>
                <div class="progress-stats">
                  <div class="progress-stat">
                    <div class="stat-value">5/8</div>
                    <div class="stat-label">岗位匹配</div>
                  </div>
                  <div class="progress-stat">
                    <div class="stat-value">3.8/5</div>
                    <div class="stat-label">表达能力</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 简历管理 -->
        <div v-if="activeMenu === 'resume'" class="resume-page">
          <div class="resume-uploader">
            <el-upload
              class="upload-area"
              drag
              action="/api/upload"
              multiple
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <div class="upload-content">
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <div class="upload-title">上传你的简历</div>
                  <div class="upload-subtitle">支持PDF、DOC、DOCX格式，大小不超过10MB</div>
                </div>
              </div>
            </el-upload>
          </div>

          <div class="resume-list">
            <h3 class="section-title">我的简历</h3>
            <el-table :data="resumes" style="width: 100%" class="resume-table">
              <el-table-column prop="name" label="文件名">
                <template #default="{ row }">
                  <div class="file-info">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="file-name">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="上传日期" width="180" />
              <el-table-column prop="size" label="文件大小" width="120" />
              <el-table-column label="操作" width="180">
                <template #default="{ row }">
                  <el-button size="small" @click="viewResume(row)">查看</el-button>
                  <el-button size="small" type="danger" @click="deleteResume(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 其他页面内容 -->
        <div v-if="activeMenu === 'interview'" class="interview-page">
          <h2>模拟面试</h2>
          <!-- 面试相关内容 -->
        </div>

        <div v-if="activeMenu === 'history'" class="history-page">
          <h2>面试历史</h2>
          <!-- 历史记录内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  House,
  Document,
  ChatLineRound,
  DataLine,
  PieChart,
  Setting,
  VideoCamera,
  UploadFilled,
  Search,
  Star,
  More,
  TrendCharts
} from '@element-plus/icons-vue'

// 用户数据
const userName = ref('张伟')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const searchQuery = ref('')

// 菜单数据
const activeMenu = ref('dashboard')
const menuItems = ref([
  { id: 'dashboard', name: '控制面板', icon: House },
  { id: 'resume', name: '简历管理', icon: Document },
  { id: 'interview', name: '模拟面试', icon: ChatLineRound },
  { id: 'history', name: '面试历史', icon: DataLine },
  { id: 'analysis', name: '能力分析', icon: PieChart },
  { id: 'settings', name: '系统设置', icon: Setting }
])

// 当前页面标题
const currentPageTitle = computed(() => {
  const item = menuItems.value.find(item => item.id === activeMenu.value)
  return item ? item.name : ''
})

// 活动数据
const activities = ref([
  { content: '完成了产品经理模拟面试', timestamp: '2小时前', icon: ChatLineRound },
  { content: '上传了最新简历文件', timestamp: '昨天', icon: Document },
  { content: '查看了前端开发能力分析', timestamp: '2天前', icon: PieChart },
  { content: '完成了技术主管模拟面试', timestamp: '2023-05-15', icon: ChatLineRound },
  { content: '更新了个人信息', timestamp: '2023-05-10', icon: Setting }
])

// 简历数据
const resumes = ref([
  { name: '张伟_前端开发工程师_2023.pdf', date: '2023-05-10', size: '2.4MB' },
  { name: '张伟_个人简历_中文版.docx', date: '2023-03-15', size: '1.8MB' },
  { name: '张伟_英文简历_CV.pdf', date: '2023-02-20', size: '1.5MB' }
])

// 进度条颜色
const colors = ref([
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
])

// 方法
const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}

const handleUploadSuccess = (response: any, file: any) => {
  console.log('上传成功', response, file)
  resumes.value.unshift({
    name: file.name,
    date: new Date().toLocaleDateString(),
    size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
  })
}

const viewResume = (resume: any) => {
  console.log('查看简历', resume)
}

const deleteResume = (resume: any) => {
  console.log('删除简历', resume)
  resumes.value = resumes.value.filter(r => r.name !== resume.name)
}

const startNewInterview = () => {
  activeMenu.value = 'interview'
}
</script>

<script lang="ts">
export default {
  name: 'MainLayout',
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
}

/* 左侧导航栏样式 */
.app-sidebar {
  width: 240px;
  background-color: #ffffff;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  color: #409eff;
}

.app-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  margin: 4px 0;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.menu-item.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
}

.menu-text {
  font-size: 14px;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #409eff;
  border-radius: 2px 0 0 2px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.user-role {
  font-size: 12px;
  color: #909399;
}

.user-dropdown {
  color: #909399;
  cursor: pointer;
  transition: all 0.3s;
}

.user-dropdown:hover {
  color: #409eff;
}

/* 主内容区域样式 */
.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-toolbar {
  padding: 16px 24px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-input {
  width: 240px;
  margin-right: 16px;
}

.new-interview-btn {
  padding: 8px 16px;
}

.content-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 仪表盘页面样式 */
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-banner {
  background: linear-gradient(135deg, #409eff, #6f7ad3);
  border-radius: 12px;
  padding: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.welcome-text h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .icon {
  font-size: 24px;
  color: #303133;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.content-section {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.section-half {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.activity-item:hover {
  background-color: #f5f7fa;
}

.activity-icon {
  width: 36px;
  height: 36px;
  background-color: #ecf5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #303133;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.progress-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.percentage-value {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}

.percentage-label {
  font-size: 14px;
  color: #909399;
}

.progress-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.progress-stat {
  text-align: center;
}

.progress-stat .stat-value {
  font-size: 18px;
  color: #409eff;
}

.progress-stat .stat-label {
  font-size: 12px;
}

/* 简历页面样式 */
.resume-page {
  max-width: 1000px;
  margin: 0 auto;
}

.resume-uploader {
  margin-bottom: 24px;
}

.upload-area {
  border-radius: 12px;
  overflow: hidden;
}

.upload-content {
  padding: 40px;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.upload-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.upload-subtitle {
  font-size: 14px;
  color: #909399;
}

.resume-list {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.resume-table {
  border-radius: 8px;
  overflow: hidden;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  color: #409eff;
}

.file-name {
  font-size: 14px;
}
</style>
