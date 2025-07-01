<template>
  <div class="history-section">
    <h2>面试历史</h2>
    <el-table :data="historyList" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180" />
      <el-table-column prop="position" label="面试职位" />
      <el-table-column prop="score" label="得分" width="100" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          <el-button size="small" type="primary" @click="replayInterview(scope.row)">回放</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const historyList = ref([
  {
    date: '2023-05-15',
    position: '前端开发工程师',
    score: '85/100'
  },
  {
    date: '2023-05-10',
    position: '产品经理',
    score: '78/100'
  },
  {
    date: '2023-05-05',
    position: 'Java开发工程师',
    score: '92/100'
  }
])

const viewDetail = (row) => {
  console.log('查看详情', row)
}

const replayInterview = (row) => {
  console.log('回放面试', row)
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
</style>
