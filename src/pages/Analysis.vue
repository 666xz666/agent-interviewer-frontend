<template>
  <div class="analysis-section">
    <h2 class="section-title">能力分析</h2>
    <div class="analysis-content">
      <el-card class="chart-card radar-card">
        <div class="chart-container">
          <h3 class="chart-title">技术能力雷达图</h3>
          <div ref="radarChartRef" class="radar-chart"></div>
        </div>
      </el-card>
      
      <el-card class="chart-card line-card">
        <div class="chart-container">
          <h3 class="chart-title">面试表现趋势</h3>
          <div ref="lineChartRef" class="line-chart"></div>
        </div>
      </el-card>
      
      <el-card class="score-card">
        <div class="score-container">
          <h3 class="chart-title">综合评分</h3>
          <div class="score-wrapper">
            <div class="score-value" :class="{'excellent': overallScore >= 90, 'good': overallScore >= 75 && overallScore < 90, 'average': overallScore >= 60 && overallScore < 75}">
              {{ overallScore }}
              <!-- <span class="score-unit">分</span> -->
            </div>
            <div class="score-badge" :class="{'excellent': overallScore >= 90, 'good': overallScore >= 75 && overallScore < 90, 'average': overallScore >= 60 && overallScore < 75}">
              {{ getScoreLevel(overallScore) }}
            </div>
          </div>
          <div class="score-description">
            <p>{{ scoreDescription }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'

// 雷达图数据
const radarChartRef = ref(null)
const skillsData = ref([
  { name: '专业知识水平', value: 88 },
  { name: '技能匹配度', value: 85 },
  { name: '语言表达能力', value: 90 },
  { name: '逻辑思维能力', value: 82 },
  { name: '应变抗压能力', value: 75 }
])

// 折线图数据
const lineChartRef = ref(null)
const trendData = ref([
  { date: '2023-01', score: 75 },
  { date: '2023-02', score: 78 },
  { date: '2023-03', score: 82 },
  { date: '2023-04', score: 85 },
  { date: '2023-05', score: 86 }
])

// 综合评分计算
const overallScore = computed(() => {
  const sum = skillsData.value.reduce((total, skill) => total + skill.value, 0)
  return Math.round(sum / skillsData.value.length)
})

// 评分描述
const scoreDescription = computed(() => {
  let strengths = []
  let improvements = []
  
  skillsData.value.forEach(skill => {
    if (skill.value >= 85) {
      strengths.push(skill.name)
    } else if (skill.value < 75) {
      improvements.push(skill.name)
    }
  })
  
  let description = '您的综合能力表现良好'
  if (strengths.length > 0) {
    description += '，在' + strengths.join('、') + '方面表现突出'
  }
  if (improvements.length > 0) {
    description += '，但在' + improvements.join('、') + '方面还有提升空间'
  }
  description += '。'
  
  return description
})

// 获取评分等级
const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 75) return '良好'
  if (score >= 60) return '一般'
  return '需提升'
}

// 初始化雷达图
const initRadarChart = () => {
  const chartDom = radarChartRef.value
  const myChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textStyle: { color: '#333' },
      formatter: (params) => {
        return `<div style="font-weight: bold;">${params.name}</div>
        <div>得分: ${params.value}</div>`
      }
    },
    radar: {
      shape: 'circle',
      indicator: skillsData.value.map(item => ({
        name: item.name,
        max: 100
      })),
      center: ['50%', '50%'],
      radius: '70%',
      axisLine: {
        lineStyle: {
          color: 'rgba(64, 158, 255, 0.2)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(64, 158, 255, 0.1)'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(64, 158, 255, 0.05)', 'rgba(64, 158, 255, 0.1)'].reverse()
        }
      },
      name: {
        textStyle: {
          color: '#606266',
          fontSize: 12
        }
      }
    },
    series: [{
      name: '能力评估',
      type: 'radar',
      data: [{
        value: skillsData.value.map(item => item.value),
        name: '当前能力',
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.3)',
          opacity: 0.5
        },
        lineStyle: {
          width: 2
        }
      }]
    }]
  }
  
  myChart.setOption(option)
  
  // 窗口大小变化时重绘图表
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  
  return myChart
}

// 初始化折线图
const initLineChart = () => {
  const chartDom = lineChartRef.value
  const myChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      textStyle: { color: '#333' },
      formatter: (params) => {
        const param = params[0]
        return `<div style="font-weight: bold;">${param.name}</div>
        <div>得分: ${param.value}</div>`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.value.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#e6e6e6'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#e6e6e6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    series: [{
      name: '面试得分',
      type: 'line',
      data: trendData.value.map(item => item.score),
      symbol: 'circle',
      symbolSize: 8,
      color: '#409EFF',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(64, 158, 255, 0.4)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(64, 158, 255, 0)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      itemStyle: {
        color: '#409EFF',
        borderColor: '#fff',
        borderWidth: 2
      },
      lineStyle: {
        width: 3
      }
    }]
  }
  
  myChart.setOption(option)
  
  // 窗口大小变化时重绘图表
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  
  return myChart
}

// 生命周期钩子
onMounted(() => {
  initRadarChart()
  initLineChart()
})
</script>

<style scoped>
.analysis-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.analysis-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.radar-card {
  grid-column: 1 / 2;
}

.line-card {
  grid-column: 2 / 3;
}

.score-card {
  grid-column: 1 / 3;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.chart-container, .score-container {
  padding: 24px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.chart-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #409EFF;
  border-radius: 2px;
  margin-right: 8px;
}

.radar-chart, .line-chart {
  height: 320px;
  width: 100%;
  background-color: #fafafa;
  border-radius: 4px;
}

.score-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
}

.score-value {
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  position: relative;
  padding-right: 16px;
}

.score-value.excellent {
  color: #67C23A;
}

.score-value.good {
  color: #409EFF;
}

.score-value.average {
  color: #E6A23C;
}

.score-unit {
  font-size: 24px;
  font-weight: 500;
  position: absolute;
  right: 0;
  top: 8px;
}

.score-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  margin-left: 16px;
}

.score-badge.excellent {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.score-badge.good {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.score-badge.average {
  background-color: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.score-description {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
  line-height: 1.8;
  color: #606266;
  font-size: 14px;
}

/* 响应式布局 */
@media (max-width: 992px) {
  .analysis-content {
    grid-template-columns: 1fr;
  }
  
  .radar-card, .line-card, .score-card {
    grid-column: 1 / 2;
  }
}
</style>  