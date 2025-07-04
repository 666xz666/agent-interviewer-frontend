<template>
  <div class="resume-management">
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
        <el-table-column label="操作" width="200">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import { getResume, getResumeList, createNewResume } from '@/api/resume'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ResumeData, ResumeListItem } from '@/api/resume';
import axios from 'axios'
const router = useRouter()
const resumes = ref<ResumeListItem[]>([])
const resumeJsonData = ref<ResumeData | null>(null)
const isDialogVisible = ref(false)

const fetchResumeList = async () => {
  try {
    const response = await getResumeList()
    const responseData = response.data
    if(responseData.status == 200) {
      resumes.value = responseData.data
    } else {
      ElMessage.error(responseData.msg || '获取简历列表失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('获取简历列表失败，请稍后重试')
  }
}

const handleCreateResume = async () => {
  const newIndex = resumes.value.length + 1
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
  }

  try {
    const response = await createNewResume(emptyResumePayload)
    const responseData = response.data
    if(responseData.status == 200) {
      const newResume = responseData.data
      resumes.value.unshift(newResume)
      ElMessage.success('新简历创建成功！')
    } else {
      ElMessage.error(response.data.msg || '简历创建失败')
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后重试')
  }
}

const updateResume = (row) => {
  router.push(`/resumeEdit/${row.resumeId}`)
}

const viewResume = async (resume) => {
  console.log('查看简历', resume)
  if (!resume || !resume.id) {
    ElMessage.error('无法获取简历，请检查简历内容是否为空')
    return
  }
  try {
    const response = await getResume(resume.id)
    const responseData = response.data
    if(responseData.status == 200) {
      resumeJsonData.value = responseData.data
      isDialogVisible.value = true
    } else {
      ElMessage.error(responseData.msg || '简历加载失败，请稍后重试')
    }
  } catch (error) {
    ElMessage.error('请求失败，请检查网络或联系管理员')
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

const handleUploadSuccess = (response, file) => {
  console.log('上传成功', response, file)
  resumes.value.unshift({
    name: file.name,
    date: new Date().toLocaleDateString(),
    size: `${(file.size / 1024 / 1024).toFixed(1)}MB`
  })
}

const downloadResume = (resumeData) => {
  ElMessage.success('简历下载功能开发中...')
}

// 初始化获取简历列表
fetchResumeList()
</script>

<style scoped>
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
</style>
