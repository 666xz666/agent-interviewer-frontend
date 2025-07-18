<template>
  <div class="history-section">
    <h2>面试历史</h2>
    <el-table
      :data="historyList"
      style="width: 100%"
      v-loading="loading"
      :row-class-name="getRowClassName"
    >
      <el-table-column prop="startTime" label="日期" width="180">
        <template #default="{ row }">
          <div class="date-cell">
            {{ formatDate(row.startTime) }}
            <span v-if="row.status === 'PROCESSING'" class="live-badge">LIVE</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="jobName" label="面试职位" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag
            :type="getStatusTagType(row.status)"
            :effect="row.status === 'PROCESSING' ? 'dark' : 'light'"
            :class="`status-tag status-${row.status.toLowerCase()}`"
          >
            <el-icon :class="`status-icon status-icon-${row.status.toLowerCase()}`">
              <component :is="getStatusIcon(row.status)" />
            </el-icon>
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          <el-button
            size="small"
            type="primary"
            @click="replayInterview(scope.row)"
            :disabled="scope.row.status !== 'COMPLETED'"
            :class="{
              'replay-btn': true,
              'replay-btn-disabled': scope.row.status !== 'COMPLETED'
            }"
          >
            <el-icon><VideoPlay /></el-icon>
            回放
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getInterviewList } from '@/api/interview'
import type { InterviewListItem } from '@/api/interview'
import { Clock, Search, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import type { DefineComponent } from 'vue'

const historyList = ref<InterviewListItem[]>([])
const loading = ref(false)

onMounted(() => {
  fetchInterviewList()
})

const fetchInterviewList = async () => {
  try {
    loading.value = true
    const response = await getInterviewList()
    historyList.value = response.data.data
  } catch (error) {
    console.error('获取面试列表失败:', error)
    ElMessage.error('获取面试列表失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    PROCESSING: '进行中',
    EVALUATING: '评估中',
    COMPLETED: '已完成',
    FAILED: '已失败'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    PROCESSING: 'warning',
    EVALUATING: 'info',
    COMPLETED: 'success',
    FAILED: 'danger'
  }
  return typeMap[status] || ''
}

const getStatusIcon = (status: string) => {
  const iconMap = {
    PROCESSING: Clock,
    EVALUATING: Search,
    COMPLETED: CircleCheck,
    FAILED: CircleClose
  }

  return iconMap[status as keyof typeof iconMap]
}

const getRowClassName = ({ row }: { row: InterviewListItem }) => {
  return `status-row-${row.status.toLowerCase()}`
}

const viewDetail = (row: InterviewListItem) => {
  console.log('查看详情', row)
  // 这里可以跳转到详情页或打开详情弹窗
}

const replayInterview = (row: InterviewListItem) => {
  console.log('回放面试', row)
  // 这里实现回放逻辑
}
</script>

<style scoped>
.history-section {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.history-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

/* 状态标签基础样式 */
.status-tag {
  font-weight: 500;
  padding: 0 10px;
}

/* 进行中 - 橙色 */
.status-processing {
  background-color: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
}

/* 评估中 - 蓝色 */
.status-evaluating {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

/* 已完成 - 绿色 */
.status-completed {
  background-color: #f6ffed;
  border-color: #b7eb8f;
  color: #52c41a;
}

/* 已失败 - 红色 */
.status-failed {
  background-color: #fff2f0;
  border-color: #ffccc7;
  color: #f5222d;
}

/* 状态图标 */
.status-icon {
  margin-right: 4px;
  font-size: 14px;
}

.status-icon-processing {
  animation: pulse 1.5s infinite;
}

/* 行状态高亮 */
:deep(.status-row-processing) {
  --el-table-tr-bg-color: #fff7e6;
}

:deep(.status-row-evaluating) {
  --el-table-tr-bg-color: #e6f7ff;
}

:deep(.status-row-completed) {
  --el-table-tr-bg-color: #f6ffed;
}

:deep(.status-row-failed) {
  --el-table-tr-bg-color: #fff2f0;
}

/* 回放按钮样式 */
.replay-btn {
  transition: all 0.3s;
}

.replay-btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.replay-btn:not(.replay-btn-disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 日期单元格 */
.date-cell {
  position: relative;
}

.live-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f5222d;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
