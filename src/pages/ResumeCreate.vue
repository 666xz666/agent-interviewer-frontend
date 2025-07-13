<template>
  <div class="resume-create">
    <h2>创建新简历</h2>

    <el-form :model="resumeForm" label-width="120px" class="resume-form">
      <!-- 基本信息 -->
      <el-card class="form-section">
        <template #header>
          <div class="section-header">基本信息</div>
        </template>

        <el-form-item label="简历名称" prop="originalFileName" required>
          <el-input v-model="resumeForm.originalFileName" placeholder="例如: 张三-前端开发工程师" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓" prop="baseInfo.lastName" required>
              <el-input v-model="resumeForm.baseInfo.lastName" placeholder="请输入您的姓" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名" prop="baseInfo.firstName" required>
              <el-input v-model="resumeForm.baseInfo.firstName" placeholder="请输入您的名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="baseInfo.gender" required>
              <el-select v-model="resumeForm.baseInfo.gender" placeholder="请选择">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="年龄" prop="baseInfo.age" required>
              <el-input-number v-model="resumeForm.baseInfo.age" :min="16" :max="70" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="baseInfo.phone" required>
              <el-input v-model="resumeForm.baseInfo.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="baseInfo.email" required>
              <el-input v-model="resumeForm.baseInfo.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="居住地" prop="baseInfo.location" required>
          <el-input v-model="resumeForm.baseInfo.location" placeholder="例如: 北京市海淀区" />
        </el-form-item>
      </el-card>

      <!-- 教育背景 -->
      <el-card class="form-section">
        <template #header>
          <div class="section-header">
            教育背景
            <el-button type="primary" size="small" @click="addEducation">添加教育经历</el-button>
          </div>
        </template>

        <div v-for="(edu, index) in resumeForm.educationList" :key="index" class="dynamic-item">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="`学校名称${index+1}`" :prop="`educationList[${index}].school`" required>
                <el-input v-model="edu.school" placeholder="例如: 中国矿业大学" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`学历${index+1}`" :prop="`educationList[${index}].degree`" required>
                <el-select v-model="edu.degree" placeholder="请选择">
                  <el-option label="高中" value="高中" />
                  <el-option label="专科" value="专科" />
                  <el-option label="本科" value="本科" />
                  <el-option label="硕士" value="硕士" />
                  <el-option label="博士" value="博士" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="`专业${index+1}`" :prop="`educationList[${index}].major`" required>
                <el-input v-model="edu.major" placeholder="例如: 计算机科学与技术" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="`开始时间${index+1}`" :prop="`educationList[${index}].startDate`" required>
                <el-date-picker
                  v-model="edu.startDate"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="`结束时间${index+1}`" :prop="`educationList[${index}].endDate`" required>
                <el-date-picker
                  v-model="edu.endDate"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-button type="danger" size="small" @click="removeEducation(index)">删除</el-button>
        </div>
      </el-card>

      <!-- 工作经历 -->
      <el-card class="form-section">
        <template #header>
          <div class="section-header">
            工作经历
            <el-button type="primary" size="small" @click="addWorkExperience">添加工作经历</el-button>
          </div>
        </template>

        <div v-for="(work, index) in resumeForm.workExperienceList" :key="index" class="dynamic-item">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="`公司名称${index+1}`" :prop="`workExperienceList[${index}].company`" required>
                <el-input v-model="work.company" placeholder="例如: 南京智图科技有限公司" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`职位${index+1}`" :prop="`workExperienceList[${index}].position`" required>
                <el-input v-model="work.position" placeholder="例如: 后端开发实习生" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item :label="`开始时间${index+1}`" :prop="`workExperienceList[${index}].startDate`" required>
                <el-date-picker
                  v-model="work.startDate"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="`结束时间${index+1}`" :prop="`workExperienceList[${index}].endDate`" required>
                <el-date-picker
                  v-model="work.endDate"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="`工作描述${index+1}`" :prop="`workExperienceList[${index}].description`" required>
            <el-input
              v-model="work.description"
              type="textarea"
              :rows="4"
              placeholder="详细描述您的工作职责和成就..."
            />
          </el-form-item>

          <el-button type="danger" size="small" @click="removeWorkExperience(index)">删除</el-button>
        </div>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="submitResume">提交简历</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { createResume } from '@/api/resume';
import { ElMessage } from 'element-plus';
import type { ResumeData } from '@/api/resume';

const resumeForm = reactive<ResumeData>({
  originalFileName: '',
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
});

// 添加教育经历
const addEducation = () => {
  resumeForm.educationList.push({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: ''
  });
};

// 删除教育经历
const removeEducation = (index: number) => {
  resumeForm.educationList.splice(index, 1);
};

// 添加工作经历
const addWorkExperience = () => {
  resumeForm.workExperienceList.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });
};

// 删除工作经历
const removeWorkExperience = (index: number) => {
  resumeForm.workExperienceList.splice(index, 1);
};

// 提交简历
const submitResume = async () => {
  try {
    // 自动生成文件名（如果用户没有输入）
    if (!resumeForm.originalFileName) {
      resumeForm.originalFileName = `${resumeForm.baseInfo.lastName}${resumeForm.baseInfo.firstName}-简历`;
    }

    const response = await createResume(resumeForm);
    if (response.data.success) {
      ElMessage.success('简历创建成功');
      // 跳转到简历管理页面
    } else {
      ElMessage.error(response.data.msg || '简历创建失败');
    }
  } catch (error) {
    ElMessage.error('请求失败: ' + error.message);
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(resumeForm, {
    originalFileName: '',
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
  });
};
</script>

<style scoped>
.resume-create {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.dynamic-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
}
</style>
