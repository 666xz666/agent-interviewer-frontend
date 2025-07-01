<template>
  <div class="main-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo-area">
        <h2>智能面试系统</h2>
      </div>
      <el-menu
        active-text-color="#3e8ef7"
        background-color="#f5f7fa"
        class="el-menu-vertical"
        default-active="dashboard"
        text-color="#606266"
        @select="handleMenuSelect"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="dashboard">
          <el-icon><House /></el-icon>
          <template #title>控制面板</template>
        </el-menu-item>
        <el-menu-item index="resume">
          <el-icon><Document /></el-icon>
          <template #title>简历管理</template>
        </el-menu-item>
        <el-menu-item index="interview">
          <el-icon><ChatLineRound /></el-icon>
          <template #title>模拟面试</template>
        </el-menu-item>
        <el-menu-item index="history">
          <el-icon><DataLine /></el-icon>
          <template #title>面试历史</template>
        </el-menu-item>
        <el-menu-item index="analysis">
          <el-icon><PieChart /></el-icon>
          <template #title>能力分析</template>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="isCollapse = !isCollapse"
            v-if="!isCollapse"
            class="menu-toggle"
          >
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button
            type="text"
            @click="isCollapse = !isCollapse"
            v-else
            class="menu-toggle"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <h2 class="page-title">{{ getPageTitle }}</h2>
        </div>
        <div class="user-info">
          <el-avatar :size="40" :src="userAvatar" />
          <span class="username">{{ userName }}</span>
          <el-dropdown trigger="click">
            <el-icon style="margin-left: 8px; cursor: pointer"><ArrowDown /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="router.push('/login')">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="content-area">
        <!-- 动态内容区域 -->
        <div v-if="activeMenu === 'dashboard'" class="dashboard">
          <div class="welcome-card">
            <h2>欢迎回来, {{ userName }}</h2>
            <p class="welcome-text">智能面试系统为您提供专业的模拟面试和能力分析服务</p>
          </div>

          <div class="quick-actions">
            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('resume')">
              <div class="card-icon bg-primary">
                <el-icon size="40"><Upload /></el-icon>
              </div>
              <h3>上传简历</h3>
              <p>上传或更新您的简历</p>
            </el-card>

            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('interview')">
              <div class="card-icon bg-secondary">
                <el-icon size="40"><VideoCamera /></el-icon>
              </div>
              <h3>开始面试</h3>
              <p>开始新的模拟面试</p>
            </el-card>

            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('analysis')">
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

        <div v-if="activeMenu === 'resume'" class="resume-management">
          <div class="header-bar">
            <h2>简历管理</h2>
            <el-button type="primary" @click="handleCreateResume" class="btn-create">
              <el-icon><Plus /></el-icon>
              创建新简历
            </el-button>
          </div>
          <el-upload
            class="upload-demo fixed-upload"
            drag
            action="/api/upload"
            multiple
            :on-success="handleUploadSuccess"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持PDF、DOC、DOCX格式，大小不超过10MB
              </div>
            </template>
          </el-upload>
            <div class="resume-list" v-if="resumes.length > 0">
              <h2>我的简历</h2>
              <el-table :data="resumes" class="fixed-table" style="width: 100%">
                <el-table-column prop="newIndex" label="序号">
                  <template #default="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="originalFileName" label="文件名" />
                <el-table-column prop="createdAt" label="上传日期" />
                <el-table-column label="操作" width="180">
                  <template #default="scope">
                    <el-button size="small" type="primary" @click="updateResume(scope.row)">编辑</el-button>
                    <el-button size="small" @click="viewResume(scope.row)">查看</el-button>
                    <el-button size="small" type="danger" @click="deleteResume(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-dialog
              v-if="resumeJsonData"
              v-model="isDialogVisible"
              :title="`简历详情: ${resumeJsonData.originalFileName}`"
              width="70%"
              custom-class="resume-dialog"
            >
              <div class="resume-content">
                <h3>基本信息</h3>
                <div class="info-row">
                  <div class="info-col">
                    <p><strong>姓名:</strong> {{ resumeJsonData.baseInfo.lastName }}{{ resumeJsonData.baseInfo.firstName }}</p>
                    <p><strong>性别:</strong> {{ resumeJsonData.baseInfo.gender }}</p>
                    <p><strong>年龄:</strong> {{ resumeJsonData.baseInfo.age }}</p>
                  </div>
                  <div class="info-col">
                    <p><strong>电话:</strong> {{ resumeJsonData.baseInfo.phone }}</p>
                    <p><strong>邮箱:</strong> {{ resumeJsonData.baseInfo.email }}</p>
                    <p><strong>住址:</strong> {{ resumeJsonData.baseInfo.location }}</p>
                  </div>
                </div>

                <el-divider />

                <h3>教育背景</h3>
                <div v-for="(edu, index) in resumeJsonData.educationList" :key="index" class="section-item">
                  <div class="edu-header">
                    <h4>{{ edu.school }} - {{ edu.degree }}</h4>
                    <span>{{ edu.startDate }} 至 {{ edu.endDate }}</span>
                  </div>
                  <p><strong>专业:</strong> {{ edu.major }}</p>
                </div>

                <el-divider />

                <h3>工作经历</h3>
                <div v-for="(work, index) in resumeJsonData.workExperienceList" :key="index" class="section-item">
                  <div class="work-header">
                    <h4>{{ work.company }} - {{ work.position }}</h4>
                    <span>{{ work.startDate }} 至 {{ work.endDate }}</span>
                  </div>
                  <p><strong>项目描述:</strong> {{ work.description }}</p>
                  <p style="white-space: pre-wrap;"><strong>职责:</strong> {{ work.responsibilities }}</p>
                </div>
              </div>

              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="downloadResume(resumeJsonData)">下载简历</el-button>
                  <el-button type="primary" @click="isDialogVisible = false">关闭</el-button>
                </div>
              </template>
          </el-dialog>
        </div>

        <!-- 其他菜单项的内容可以在这里添加 -->
        <div v-if="activeMenu === 'interview'" class="interview-section">
          <h2>模拟面试</h2>
          <!-- 面试相关内容 -->
        </div>

        <div v-if="activeMenu === 'history'" class="history-section">
          <h2>面试历史</h2>
          <!-- 历史记录内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  House,
  Document,
  ChatLineRound,
  DataLine,
  PieChart,
  Setting,
  ArrowDown,
  Upload,
  VideoCamera,
  TrendCharts,
  Plus,
  UploadFilled,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getResume, getResumeList, createNewResume } from '@/api/resume'
import { getUserProfile } from '@/api/user'
import type { ResumeData, ResumeListItem } from '@/api/resume';
const router = useRouter()
const activeMenu = ref('dashboard')
const resumeJsonData = ref<ResumeData | null>(null);
const isDialogVisible = ref(false);
const userName = ref('张三')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const isCollapse = ref(false);

// 模拟数据
const interviewCount = ref(5);
const resumeCount = ref(3);
const scoreValue = ref(72);

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

// 计算页面标题
const getPageTitle = computed(() => {
  const titleMap = {
    'dashboard': '控制面板',
    'resume': '简历管理',
    'interview': '模拟面试',
    'history': '面试历史',
    'analysis': '能力分析',
    'settings': '系统设置'
  };
  return titleMap[activeMenu.value] || '智能面试系统';
});

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const response = await getUserProfile();
    if (response.data.status === 200 && response.data.success) {
      const userData = response.data.data;
      userName.value = userData.username || '用户';
    } else {
      ElMessage.error(response.data.msg || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败，请稍后重试');
  }
};


const resumes = ref<ResumeListItem[]>([]);

const updateResume = (row) => {
  router.push(`/pages/ResumeEditPage/${row.resumeId}`);
};

const handleCreateResume = async () => {
  const newIndex = resumes.value.length + 1;
  const emptyResumePayload: ResumeData = {
    originalFileName: `新建简历 - ${newIndex}`,
    baseInfo: {
      firstName: '',
      lastName: '',
      gender: '',
      age: 0,
      phone: '',
      email: '',
      location: ''
    },
    educationList: [],
    workExperienceList: []
  };

  try {
    const response = await createNewResume(emptyResumePayload);
    const responseData = response.data;
    if(responseData.status == 200) {
      const newResume = responseData.data;
      resumes.value.unshift(newResume);
      ElMessage.success('新简历创建成功！');
    }
    else {
      ElMessage.error(response.data.msg || '简历创建失败');
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后重试');
  }
};

const fetchResumeList = async () => {
  try {
    const response = await getResumeList();
    const responseData = response.data;
    if(responseData.status == 200) {
      resumes.value = responseData.data;
    }
    else
    {
      ElMessage.error(responseData.msg || '获取简历列表失败，请稍后重试');
    }
  } catch (error) {
    ElMessage.error('获取简历列表失败，请稍后重试');
  }
};

const handleMenuSelect = (key: string) => {
  activeMenu.value = key
}

onMounted(() => {
  fetchUserProfile();
  fetchResumeList();
});

const handleUploadSuccess = (response: any, file: any) => {
  console.log('上传成功', response, file)
  // 更新简历列表
  resumes.value.unshift({
    name: file.name,
    date: new Date().toLocaleDateString(),
    size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
  })
}

const viewResume = async (resume: any) => {
  console.log('查看简历', resume);
  if (!resume || !resume.id) {
    ElMessage.error('无法获取简历，请检查简历内容是否为空');
    return;
  }
  try {
    const response = await getResume(resume.id);
    const responseData = response.data;
    if(responseData.status == 200)
    {
      ElMessage.error(responseData.msg || '简历加载失败，请稍后重试');
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络或联系管理员');
  }
}

const deleteResume = async (row) => {
  try {
    await ElMessageBox.confirm(
      `您确定要删除该简历吗？`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    await axios.delete('/api/resume/delete', {
      params: {
        resumeId: row.resumeId
      }
    });
    resumes.value = resumes.value.filter(item => item.resumeId !== row.resumeId);

    ElMessage({
      type: 'success',
      message: '删除成功',
    });

  } catch (error) {
    if (error !== 'cancel') {
      console.error("删除失败:", error);
      ElMessage({
        type: 'error',
        message: '删除失败，请稍后再试',
      });
    } else {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    }
  }
}

// 下载简历功能
const downloadResume = (resumeData: ResumeData) => {
  // 模拟下载功能
  ElMessage.success('简历下载功能开发中...');
  // 实际项目中可调用API下载简历
  // const url = `/api/resume/download/${resumeData.id}`;
  // window.open(url);
}
</script>

<script lang="ts">
export default {
  name: 'MainLayout',
}
</script>

<style scoped>
/* === 全局样式重置 === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

body, html, #app {
  height: 100%;
  width: 100%;
  background-color: #f5f7fa;
}

/* === 整体布局 === */
.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* === 侧边栏样式 === */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  color: #606266;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: width 0.3s ease;
  position: relative;
  z-index: 100;
}

.sidebar.collapsed {
  width: 64px;
}

.logo-area {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.logo-area h2 {
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  background-color: transparent;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  transition: all 0.3s;
}

.el-menu-item:hover {
  background-color: #f5f7fa;
}

.el-menu-item.is-active {
  background-color: #eef2ff;
  color: #3e8ef7;
}

.el-menu-item.is-active .el-icon {
  color: #3e8ef7;
}

.el-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  vertical-align: middle;
}

/* === 主内容区域样式 === */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* === 顶部导航栏样式 === */
.header {
  padding: 0 20px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 60px;
  flex-shrink: 0;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 20px;
  font-size: 16px;
  color: #606266;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: 500;
  color: #303133;
}

/* === 内容区域样式 === */
.content-area {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100vh - 60px); /* 减去header高度 */
  background-color: #f5f7fa;
}

/* === 控制面板样式 === */
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

/* === 简历管理样式 === */
.resume-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-bar h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.btn-create {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-create:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.fixed-upload {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.resume-list {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resume-list h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.fixed-table {
  flex: 1;
  overflow-y: auto;
}

/* === 简历详情弹窗样式 === */
.resume-dialog {
  .el-dialog__header {
    background-color: #f5f7fa;
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  .el-dialog__body {
    padding: 30px;
  }
}

.resume-content {
  color: #606266;
}

.resume-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.info-col {
  flex: 1;
}

.section-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #ebeef5;
}

.edu-header, .work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.edu-header h4, .work-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* === 响应式设计 === */
@media (max-width: 1200px) {
  .quick-actions, .data-cards {
    flex-direction: column;
  }
  
  .action-card, .data-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    z-index: 1000;
  }
  
  .main-content {
    height: calc(100vh - 60px); /* 减去header高度 */
  }
  
  .content-area {
    padding: 15px;
    height: calc(100vh - 120px); /* 减去header和导航栏高度 */
  }
  
  .header {
    padding: 0 15px;
  }
  
  .welcome-card {
    padding: 20px;
  }
  
  .welcome-card h2 {
    font-size: 20px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>