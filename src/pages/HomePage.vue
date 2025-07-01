<template>
  <div class="main-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo-area">
        <h2>智能面试系统</h2>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical"
        default-active="dashboard"
        text-color="#fff"
        @select="handleMenuSelect"
      >
        <el-menu-item index="dashboard">
          <el-icon><House /></el-icon>
          <span>控制面板</span>
        </el-menu-item>
        <el-menu-item index="resume">
          <el-icon><Document /></el-icon>
          <span>简历管理</span>
        </el-menu-item>
        <el-menu-item index="interview">
          <el-icon><ChatLineRound /></el-icon>
          <span>模拟面试</span>
        </el-menu-item>
        <el-menu-item index="history">
          <el-icon><DataLine /></el-icon>
          <span>面试历史</span>
        </el-menu-item>
        <el-menu-item index="analysis">
          <el-icon><PieChart /></el-icon>
          <span>能力分析</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="header">
        <div class="user-info">
          <el-avatar :size="40" :src="userAvatar" />
          <span class="username">{{ userName }}</span>
          <el-dropdown>
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
          <h2>欢迎回来, {{ userName }}</h2>
          <p class="welcome-text">智能面试系统为您提供专业的模拟面试和能力分析服务</p>

          <div class="quick-actions">
            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('resume')">
              <el-icon size="40"><Upload /></el-icon>
              <h3>上传简历</h3>
              <p>上传或更新您的简历</p>
            </el-card>

            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('interview')">
              <el-icon size="40"><VideoCamera /></el-icon>
              <h3>开始面试</h3>
              <p>开始新的模拟面试</p>
            </el-card>

            <el-card shadow="hover" class="action-card" @click="handleMenuSelect('analysis')">
              <el-icon size="40"><TrendCharts /></el-icon>
              <h3>查看分析</h3>
              <p>查看能力分析报告</p>
            </el-card>
          </div>

          <div class="recent-activities">
            <h3>最近活动</h3>
            <el-timeline class="fixed-timeline">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <div v-if="activeMenu === 'resume'" class="resume-management">
          <div class="header-bar">
            <h2>简历管理</h2>
            <el-button type="primary" @click="handleCreateResume">
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
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button size="small" @click="updateResume(scope.row)">编辑</el-button>
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
            >
              <div class="resume-content">
                <h3>基本信息</h3>
                <p><strong>姓名:</strong> {{ resumeJsonData.baseInfo.lastName }}{{ resumeJsonData.baseInfo.firstName }}</p>
                <p><strong>性别:</strong> {{ resumeJsonData.baseInfo.gender }}</p>
                <p><strong>年龄:</strong> {{ resumeJsonData.baseInfo.age }}</p>
                <p><strong>电话:</strong> {{ resumeJsonData.baseInfo.phone }}</p>
                <p><strong>邮箱:</strong> {{ resumeJsonData.baseInfo.email }}</p>
                <p><strong>住址:</strong> {{ resumeJsonData.baseInfo.location }}</p>

                <el-divider />

                <h3>教育背景</h3>
                <div v-for="(edu, index) in resumeJsonData.educationList" :key="index" class="section-item">
                  <p><strong>学校:</strong> {{ edu.school }}</p>
                  <p><strong>学位:</strong> {{ edu.degree }}</p>
                  <p><strong>专业:</strong> {{ edu.major }}</p>
                  <p><strong>时间:</strong> {{ edu.startDate }} 至 {{ edu.endDate }}</p>
                </div>

                <el-divider />

                <h3>工作经历</h3>
                <div v-for="(work, index) in resumeJsonData.workExperienceList" :key="index" class="section-item">
                  <p><strong>公司:</strong> {{ work.company }}</p>
                  <p><strong>职位:</strong> {{ work.position }}</p>
                  <p><strong>项目描述:</strong> {{ work.description }}</p>
                  <p><strong>时间:</strong> {{ work.startDate }} 至 {{ work.endDate }}</p>
                  <p style="white-space: pre-wrap;"><strong>职责:</strong> {{ work.description }}</p>
                </div>
              </div>

              <template #footer>
                <div class="dialog-footer">
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
import { ref, onMounted } from 'vue'
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
  UploadFilled
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

const activities = ref([
  {
    content: '完成了模拟产品经理面试',
    timestamp: '2023-05-15'
  },
  {
    content: '上传了最新简历',
    timestamp: '2023-05-10'
  },
  {
    content: '查看了能力分析报告',
    timestamp: '2023-05-05'
  }
])




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
      ElMessage.success('简历加载成功！');
      resumeJsonData.value = responseData;
      isDialogVisible.value = true;
    }
    else
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
</script>

<script lang="ts">
export default {
  name: 'MainLayout',
}
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.json-viewer {
  background-color: #f4f4f5;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
  line-height: 1.5;
  font-family: 'Courier New', Courier, monospace;
}
/* === 禁止所有滚动 === */
html, body, #app, .main-container {
  overflow: hidden !important;
  height: 100% !important;
  width: 100% !important;
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
}

/* === 整体布局 === */
.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* === 侧边栏 - 固定高度，不滚动 === */
.sidebar {
  width: 260px;
  background-color: #545c64;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo-area {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #434a50;
  flex-shrink: 0;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
  overflow: hidden;
}

/* === 主内容区域 - 固定高度，不滚动 === */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* === 顶部导航栏 - 固定高度 === */
.header {
  padding: 15px 20px;
  background-color: #f5f7fa;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  height: 60px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: 500;
}

/* === 内容区域 - 固定高度，不滚动 === */
.content-area {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 60px); /* 减去header高度 */
}

/* === 控制面板样式 === */
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.welcome-text {
  color: #666;
  margin-bottom: 30px;
}

.quick-actions {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.action-card {
  flex: 1;
  min-width: 220px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  box-sizing: border-box;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card h3 {
  margin: 10px 0;
}

.action-card p {
  color: #666;
  font-size: 14px;
}

.recent-activities {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-timeline {
  flex: 1;
  overflow: hidden;
}

/* === 简历管理样式 === */
.resume-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.fixed-upload {
  margin: 30px 0;
  flex-shrink: 0;
}

.resume-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-table {
  flex: 1;
  overflow: hidden;
}

/* === 所有内容区域 === */
.dashboard, .resume-management, .interview-section, .history-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* === 响应式设计 === */
@media (max-width: 992px) {
  .quick-actions {
    flex-direction: column;
  }

  .action-card {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .main-content {
    height: calc(100vh - 60px); /* 减去导航栏高度 */
  }

  .content-area {
    padding: 15px;
    height: calc(100vh - 120px); /* 减去header和导航栏高度 */
  }

  .header {
    padding: 10px 15px;
  }

  .el-menu-vertical {
    width: 100%;
  }

  .dashboard h2 {
    font-size: 1.5rem;
  }

  .action-card {
    min-width: 100%;
  }
}

/* === 防止内容溢出 === */
* {
  box-sizing: border-box;
}
</style>