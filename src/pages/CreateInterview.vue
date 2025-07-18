<template>
  <div class="create-interview-container">
    <el-page-header @back="goBack" title="返回">
      <template #content>
        <h2>创建新面试</h2>
      </template>
    </el-page-header>

    <el-card class="form-card">
      <el-form :model="form" label-width="120px" label-position="top">
        <el-form-item label="选择面试官" required>
          <el-select
            v-model="form.interviewerId"
            placeholder="请选择面试官"
            style="width: 100%"
            @change="handleInterviewerChange"
          >
            <el-option
              v-for="item in interviewerList"
              :key="item.interviewerId"
              :label="item.name"
              :value="item.interviewerId"
            >
              <div>
                <div>{{ item.name }}</div>
                <div style="font-size: 12px; color: #999">{{ item.description }}</div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择简历" required>
          <el-select
            v-model="form.resumeId"
            placeholder="请选择简历"
            style="width: 100%"
            @change="handleResumeChange"
          >
            <el-option
              v-for="item in resumeList"
              :key="item.resumeId"
              :label="item.originalFileName"
              :value="item.resumeId"
            >
              <div>
                <div>{{ item.originalFileName }}</div>
                <div style="font-size: 12px; color: #999">
                  创建时间: {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择岗位" required>
          <el-select
            v-model="form.jobId"
            placeholder="请选择岗位"
            style="width: 100%"
            @change="handleJobChange"
          >
            <el-option
              v-for="item in jobList"
              :key="item.jobId"
              :label="item.jobName"
              :value="item.jobId"
            >
              <div style="display: flex; align-items: center; min-width: 300px; max-width: 400px">
                <div style="margin-left: 10px; min-width: 0">
                  <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                    {{ item.jobName }}
                  </div>
                  <div
                    style="
                      font-size: 12px;
                      color: #999;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item.jobDescription }}
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="选择知识库" required>
          <el-select
            v-model="form.knowledgeId"
            placeholder="请选择知识库"
            style="width: 100%"
            :disabled="!form.jobId"
          >
            <el-option
              v-for="item in knowledgeBaseList"
              :key="item.knowledgeId"
              :label="item.knowledgeName"
              :value="item.knowledgeId"
            >
              <div style="display: flex; align-items: center; min-width: 300px; max-width: 400px">
                <div style="margin-left: 10px; min-width: 0">
                  <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                    {{ item.knowledgeName }}
                  </div>
                  <div
                    style="
                      font-size: 12px;
                      color: #999;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="startInterview"
            :loading="loading"
            size="large"
            style="width: 100%"
          >
            开始面试
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getInterviewerList,
  getJobList,
  getKnowledgeBaseList,
  createInterview,
} from "@/api/interview";
import type { Interviewer, Job, KnowledgeBase } from "@/api/interview";
import type { ResumeListItem } from "@/api/resume";
import { getResumeList } from "@/api/resume";
import { ElMessage } from 'element-plus'

const router = useRouter();

const loading = ref(false);
const interviewerList = ref<Interviewer[]>([]);
const jobList = ref<Job[]>([]);
const knowledgeBaseList = ref<KnowledgeBase[]>([]);
const resumeList = ref<ResumeListItem[]>([]);

const form = ref({
  interviewerId: null as number | null,
  resumeId: null as number | null,
  jobId: null as number | null,
  knowledgeId: null as number | null,
});

onMounted(() => {
  loadInterviewOptions();
});

const loadInterviewOptions = async () => {
  try {
    const [interviewersRes, jobsRes, resumesRes] = await Promise.all([
      getInterviewerList(),
      getJobList(),
      getResumeList()
    ]);

    interviewerList.value = interviewersRes.data.data;
    jobList.value = jobsRes.data.data;
    resumeList.value = resumesRes.data.data;
  } catch (error) {
    ElMessage.error("加载面试选项失败");
  }
};

// 格式化日期显示
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const handleResumeChange = (resumeId: number) => {
  console.log("选择的简历ID:", resumeId);
};

const handleInterviewerChange = (interviewerId: number) => {
  console.log("选择的面试官ID:", interviewerId);
};

const handleJobChange = async (jobId: number) => {
  if (!jobId) return;

  try {
    const res = await getKnowledgeBaseList(jobId);
    knowledgeBaseList.value = res.data.data;
    form.value.knowledgeId = null;
  } catch (error) {
    ElMessage.error("加载知识库失败");
  }
};

const startInterview = async () => {
  if (!form.value.interviewerId || !form.value.resumeId || !form.value.jobId || !form.value.knowledgeId) {
    ElMessage.warning("请完整选择面试官、简历、岗位和知识库");
    return;
  }

  try {
    loading.value = true;

    // 1. 先创建面试
    const res = await createInterview({
      interviewerId: form.value.interviewerId,
      resumeId: form.value.resumeId,
      jobId: form.value.jobId,
      knowledgeBaseId: form.value.knowledgeId
    });

    if (!res.data.success || !res.data.data?.interviewId) {
      throw new Error(res.data.msg || "创建面试失败");
    }

    ElMessage.success(res.data.msg || "面试创建成功！");

    // 2. 跳转到面试页面并传递必要参数
    router.push({
      path: "/interview",
      query: {
        interviewId: res.data.data.interviewId,
        interviewerId: res.data.data.interviewerId,
        jobId: res.data.data.jobId,
        resumeId: res.data.data.resumeId,
        status: res.data.data.status,
        // 添加标志表示需要自动开始面试
        autoStart: 'true'
      }
    });

  } catch (error) {
    console.error("创建面试失败:", error);
    ElMessage.error(error.response?.data?.msg || error.message || "创建面试失败");
  } finally {
    loading.value = false;
  }
};


const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.create-interview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-card {
  margin-top: 20px;
}

.el-select {
  width: 100%;
}

/* 下拉菜单样式控制 */
::v-deep .el-select-dropdown {
  max-width: 600px;
  width: auto;
}
</style>
