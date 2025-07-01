<template>
  <div class="analysis-section">
    <h2>能力分析</h2>
    <div class="analysis-content">
      <el-card class="chart-card">
        <div class="chart-container">
          <h3>技术能力雷达图</h3>
          <div class="radar-chart"></div>
        </div>
      </el-card>
      <el-card class="chart-card">
        <div class="chart-container">
          <h3>面试表现趋势</h3>
          <div class="line-chart"></div>
        </div>
      </el-card>
      <el-card class="score-card">
        <div class="score-container">
          <h3>综合评分</h3>
          <div class="score-value">86</div>
          <div class="score-description">
            <p>您的综合能力表现良好，在技术能力和沟通表达方面表现突出，但在项目管理和团队协作方面还有提升空间。</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const skillsData = ref([
  { name: '技术能力', value: 85 },
  { name: '沟通表达', value: 90 },
  { name: '项目管理', value: 70 },
  { name: '团队协作', value: 75 },
  { name: '问题解决', value: 80 }
])

const trendData = ref([
  { date: '2023-01', score: 75 },
  { date: '2023-02', score: 78 },
  { date: '2023-03', score: 82 },
  { date: '2023-04', score: 85 },
  { date: '2023-05', score: 86 }
])
</script>

<style scoped>
.analysis-section {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.analysis-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.analysis-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
}

.chart-card {
  grid-column: span 1;
}

.score-card {
  grid-column: span 2;
}

.chart-container, .score-container {
  padding: 20px;
}

.chart-container h3, .score-container h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.radar-chart, .line-chart {
  height: 300px;
  width: 100%;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.score-value {
  font-size: 48px;
  font-weight: 600;
  color: #409EFF;
  text-align: center;
  margin: 20px 0;
}

.score-description {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.score-description p {
  color: #606266;
  line-height: 1.6;
}
</style>
