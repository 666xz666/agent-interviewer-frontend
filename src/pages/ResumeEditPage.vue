<template>
  <div class="edit-page-container">
    <div class="resume-form-container">
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <el-button @click="goBack" :icon="ArrowLeft" circle plain></el-button>
              <span>编辑简历</span>
            </div>
            <el-button type="primary" @click="saveChanges" :loading="isSaving">保存更新</el-button>
          </div>
        </template>

        <div v-if="loading" class="loading-text">正在加载简历数据...</div>
        <el-form v-else-if="resumeForm" :model="resumeForm" label-position="top">
          <h3>简历名称</h3>
          <el-form-item>
            <el-input
              v-model="resumeForm.originalFileName"
              placeholder="为你的简历起一个方便识别的名字"
              size="large"
            ></el-input>
          </el-form-item>
          <el-divider />
          <h3>基本信息</h3>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="姓">
                <el-input v-model="resumeForm.baseInfo.lastName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名">
                <el-input v-model="resumeForm.baseInfo.firstName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <el-radio-group v-model="resumeForm.baseInfo.gender">
                  <el-radio-button label="男" />
                  <el-radio-button label="女" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄">
                <el-input-number v-model="resumeForm.baseInfo.age" :min="16" :max="100" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话">
                <el-input v-model="resumeForm.baseInfo.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="resumeForm.baseInfo.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所在地区">
                <el-input v-model="resumeForm.baseInfo.location" placeholder="例如：北京，中国"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />

          <h3>教育背景</h3>
          <div v-for="(edu, index) in resumeForm.educationList" :key="index" class="form-section">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="学校">
                  <el-input v-model="edu.school" placeholder="例如：XX大学"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                 <el-form-item label="专业">
                  <el-input v-model="edu.major" placeholder="例如：计算机科学与技术"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学位">
                  <el-input v-model="edu.degree" placeholder="例如：学士/硕士"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起止时间">
                   <el-date-picker
                      v-model="edu.timeRange"
                      type="monthrange"
                      range-separator="至"
                      start-placeholder="入学月份"
                      end-placeholder="毕业月份"
                      style="width: 100%;"
                    />
                </el-form-item>
              </el-col>
            </el-row>
            <el-button class="remove-btn" type="danger" circle :icon="Delete" @click="removeEducation(index)"></el-button>
          </div>
          <el-button @click="addEducation" :icon="Plus">添加教育经历</el-button>
          <el-divider />

          <h3>工作经历</h3>
          <div v-for="(work, index) in resumeForm.workExperienceList" :key="index" class="form-section">
             <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="公司">
                    <el-input v-model="work.company" placeholder="请输入公司名称"></el-input>
                  </el-form-item>
                </el-col>
                 <el-col :span="12">
                  <el-form-item label="职位">
                    <el-input v-model="work.position" placeholder="例如：前端开发工程师"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="起止时间">
                     <el-date-picker
                        v-model="work.timeRange"
                        type="monthrange"
                        range-separator="至"
                        start-placeholder="入职月份"
                        end-placeholder="离职月份"
                        style="width: 100%;"
                      />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="工作描述">
                    <el-input v-model="work.description" type="textarea" :rows="4" placeholder="简要描述你的工作内容和职责..."></el-input>
                  </el-form-item>
                </el-col>
             </el-row>
             <el-button class="remove-btn" type="danger" circle :icon="Delete" @click="removeWorkExperience(index)"></el-button>
          </div>
          <el-button @click="addWorkExperience" :icon="Plus">添加工作经历</el-button>

        </el-form>
      </el-card>
    </div>

    <div class="ai-assistant-container">
      <el-card class="chat-card">
        <template #header>
          <div class="card-header">
            <span>简历助手</span>
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
        </div>

        <div class="chat-input-area">
          <el-input
            v-model="userInput"
            placeholder="可以问我如何优化简历..."
            @keyup.enter="handleSendMessage"
            :disabled="isStreaming"
            size="large"
          >
            <template #append>
              <el-button @click="handleSendMessage" :loading="isStreaming" type="primary">发送</el-button>
            </template>
          </el-input>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage, ElCard, ElForm, ElFormItem, ElInput, ElRow, ElCol, ElButton, ElDivider, ElIcon } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
import type { ResumeData, BasicInfo, Education, WorkExperience } from '@/api/resume';
import { ArrowLeft } from '@element-plus/icons-vue';
import { getResume, getResumeList, updateResume } from '@/api/resume'

// --- 通用变量 ---
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const isSaving = ref(false);

// --- 简历表单相关逻辑 ---
const resumeForm = ref<ResumeData>({
  resumeId: undefined,
  createdAt: '',
  originalFileName: '',
  baseInfo: {
    firstName: '', lastName: '', gender: '', age: 0, phone: '', email: '', location: ''
  },
  educationList: [],
  workExperienceList: []
});

// 加载单个简历数据
const loadResumeData = async () => {
  loading.value = true;
  try {
    const resumeId = route.params.resumeId as string;
    if (!resumeId) throw new Error('缺少简历ID');

    const response = await getResume(resumeId);
    const responseData = response.data;

    if (responseData.status === 200 && responseData.data) {
      // 解析结构化数据
      const parsedData = responseData.data.structuredData
        ? JSON.parse(responseData.data.structuredData)
        : {};

      // 设置表单数据
      resumeForm.value = {
        resumeId: responseData.data.resumeId,
        originalFileName: responseData.data.originalFileName,
        createdAt: responseData.data.createdAt,
        baseInfo: parsedData.baseInfo || {
          firstName: '', lastName: '', gender: '', age: 0, phone: '', email: '', location: ''
        },
        educationList: parsedData.educationList || [],
        workExperienceList: parsedData.workExperienceList || []
      };

      // 处理时间范围数据
      resumeForm.value.educationList.forEach((edu: any) => {
        if (edu.startDate && edu.endDate) {
          edu.timeRange = [new Date(edu.startDate + '-01'), new Date(edu.endDate + '-01')];
        } else {
          edu.timeRange = [];
        }
      });

      resumeForm.value.workExperienceList.forEach((work: any) => {
        if (work.startDate && work.endDate) {
          work.timeRange = [new Date(work.startDate + '-01'), new Date(work.endDate + '-01')];
        } else {
          work.timeRange = [];
        }
      });
    } else {
      throw new Error(responseData.msg || '简历加载失败');
    }
  } catch (error) {
    console.error('加载简历失败:', error);
    ElMessage.error('加载简历失败: ' + (error instanceof Error ? error.message : '未知错误'));
    router.back();
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/resume');
};

const saveChanges = async () => {
  if (!resumeForm.value || !resumeForm.value.resumeId) {
    ElMessage.warning('简历ID不存在');
    return;
  }

  isSaving.value = true;
  try {
    // 按照接口文档格式准备数据
    const payload = {
      resumeId: resumeForm.value.resumeId,
      originalFileName: resumeForm.value.originalFileName,
      baseInfo: {
        firstName: resumeForm.value.baseInfo.firstName,
        lastName: resumeForm.value.baseInfo.lastName,
        gender: resumeForm.value.baseInfo.gender,
        age: resumeForm.value.baseInfo.age,
        phone: resumeForm.value.baseInfo.phone,
        email: resumeForm.value.baseInfo.email,
        location: resumeForm.value.baseInfo.location
      },
      educationList: resumeForm.value.educationList.map(edu => ({
        school: edu.school,
        degree: edu.degree,
        major: edu.major,
        startDate: formatDate(edu.timeRange[0]),
        endDate: formatDate(edu.timeRange[1], true) // 处理"至今"情况
      })),
      workExperienceList: resumeForm.value.workExperienceList.map(work => ({
        company: work.company,
        position: work.position,
        description: work.description,
        startDate: formatDate(work.timeRange[0]),
        endDate: formatDate(work.timeRange[1])
      }))
    };

    // 调试输出
    console.log('发送的请求体:', JSON.stringify(payload, null, 2));

    const response = await updateResume(payload);

    if (response.data.success) {
      ElMessage.success('简历更新成功！');
      router.back();
    } else {
      throw new Error(response.data.msg || '更新失败');
    }
  } catch (error) {
    console.error("更新失败:", error);
    if (axios.isAxiosError(error)) {
      console.error("错误详情:", {
        url: error.config?.url,
        data: error.config?.data,
        response: error.response?.data
      });
    }
    ElMessage.error("更新失败: " + (error instanceof Error ? error.message : '未知错误'));
  } finally {
    isSaving.value = false;
  }
};

// 辅助函数：格式化日期为YYYY-MM格式
function formatDate(date: Date): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

const addEducation = () => {
  resumeForm.value.educationList.push({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    timeRange: []
  });
};

const removeEducation = (index: number) => {
  resumeForm.value.educationList.splice(index, 1);
};

const addWorkExperience = () => {
  resumeForm.value.workExperienceList.push({
    company: '',
    position: '',
    description: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    timeRange: []
  });
}

const removeWorkExperience = (index: number) => {
  resumeForm.value.workExperienceList.splice(index, 1);
}

// --- AI 助手相关逻辑 ---
const userInput = ref('');
const chatHistory = ref<{role: 'user' | 'assistant', content: string}[]>([
  { role: 'assistant', content: '你好！有什么可以帮您优化这份简历的吗？可以说"帮我优化一下工作经历"' }
]);
const isStreaming = ref(false);
const chatWindowRef = ref<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight;
    }
  });
};

const handleSendMessage = async () => {
  if (!userInput.value.trim() || isStreaming.value) return;

  const userMessage = userInput.value;
  chatHistory.value.push({ role: 'user', content: userMessage });
  userInput.value = '';
  scrollToBottom();

  isStreaming.value = true;
  chatHistory.value.push({ role: 'assistant', content: '' });

  try {
    const payload = {
      content: userMessage,
      histories: chatHistory.value.slice(0, -2)
    };

    const response = await fetch('/api/chat-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
      throw new Error('Network response was not ok.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');
      lines.forEach(line => {
        if (line.startsWith('data:')) {
          const jsonStr = line.substring(5);
          if (jsonStr) {
            try {
              const data = JSON.parse(jsonStr);
              chatHistory.value[chatHistory.value.length - 1].content += data.content;
              scrollToBottom();
            } catch (e) {
              console.error("Failed to parse stream chunk JSON:", jsonStr);
            }
          }
        }
      });
    }

  } catch (error) {
    console.error("AI chat stream failed:", error);
    chatHistory.value[chatHistory.value.length - 1].content = "抱歉，我好像出了一点问题...";
  } finally {
    isStreaming.value = false;
  }
};

// 初始化加载简历数据
onMounted(() => {
  loadResumeData();
});
</script>

<style scoped>
.edit-page-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
}

.resume-form-container {
  flex: 2;
  overflow-y: auto;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.ai-assistant-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.loading-text {
  text-align: center;
  color: #909399;
  padding: 40px;
}

.form-card {
  border: none;
  box-shadow: none;
}

.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  padding: 0;
}

.chat-window {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-wrapper {
  margin-bottom: 15px;
  display: flex;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 95%;
  align-items: flex-start;
}

.message .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-weight: bold;
}

.message .content {
  padding: 10px 15px;
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
  background-color: #409eff;
}

.message.user .content {
  background-color: #ecf5ff;
  border-radius: 12px 12px 0 12px;
}

.message.assistant {
  margin-right: auto;
}

.message.assistant .avatar {
  background-color: #67c23a;
}

.message.assistant .content {
  background-color: #f0f9eb;
  border-radius: 12px 12px 12px 0;
}

.chat-input-area {
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
}

.form-section {
  background-color: #f9fafb;
  padding: 15px;
  border: 1px dashed #e4e7ed;
  margin-bottom: 15px;
  position: relative;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left span {
  margin-left: 8px;
}
</style>
