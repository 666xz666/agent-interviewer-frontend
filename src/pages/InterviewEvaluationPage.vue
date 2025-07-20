<template>
  <div class="evaluation-container">
    <!-- 总体评价部分 -->
    <div class="overall-evaluation">
      <h2>面试总体评价</h2>
      <div class="evaluation-content">
        <div class="radar-chart">
          <el-progress type="dashboard" :percentage="overallScore" :color="colors">
            <template #default>
              <span class="score-text">{{ overallScore }}分</span>
              <p class="score-level">{{ getScoreLevel(overallScore) }}</p>
            </template>
          </el-progress>
        </div>
        <div class="evaluation-text">
          <h3>AI 综合评价</h3>
          <p>{{ aiEvaluation }}</p>
          <div class="indicator-grid">
            <div v-for="(indicator, index) in coreIndicators" :key="index" class="indicator-item">
              <div class="indicator-label">{{ indicator.name }}</div>
              <el-progress
                :percentage="indicator.score"
                :stroke-width="12"
                :color="getIndicatorColor(indicator.score)"
              />
              <div class="indicator-score">{{ indicator.score }}分</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话轮次详情 -->
    <div class="conversation-details">
      <h2>面试对话分析</h2>
      <el-collapse v-model="activeRound" accordion>
        <el-collapse-item
          v-for="(round, index) in conversationRounds"
          :key="index"
          :name="index"
          :title="`第${index + 1}轮 - ${getRoundTypeName(round.type)}`"
        >
          <div class="round-detail">
            <div class="round-chart">
              <el-progress type="dashboard" :percentage="round.score" :color="colors">
                <template #default>
                  <span class="score-text">{{ round.score }}分</span>
                </template>
              </el-progress>
            </div>
            <div class="round-analysis">
              <h4>AI 分析</h4>
              <p>{{ round.analysis }}</p>
              <div class="round-indicators">
                <div v-for="(indicator, i) in round.indicators" :key="i" class="indicator-item">
                  <div class="indicator-label">{{ indicator.name }}</div>
                  <el-progress
                    :percentage="indicator.score"
                    :stroke-width="10"
                    :color="getIndicatorColor(indicator.score)"
                  />
                </div>
              </div>
              <div class="conversation-content">
                <h4>对话内容</h4>
                <div class="dialog-bubble" v-for="(dialog, i) in round.dialogs" :key="i">
                  <div class="dialog-avatar">
                    <el-avatar :src="dialog.role === 'interviewer' ? interviewerAvatar : candidateAvatar" />
                  </div>
                  <div class="dialog-text" :class="{'interviewer': dialog.role === 'interviewer', 'candidate': dialog.role === 'candidate'}">
                    <div class="dialog-role">{{ dialog.role === 'interviewer' ? '面试官' : '候选人' }}</div>
                    <div class="dialog-message">{{ dialog.message }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 推荐课程 -->
    <div class="recommendations">
      <h2>推荐提升课程</h2>
      <div class="course-list">
        <div v-for="(course, index) in recommendedCourses" :key="index" class="course-card">
          <div class="course-image">
            <img :src="course.image" alt="课程封面">
          </div>
          <div class="course-info">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="course-meta">
              <span class="course-provider">{{ course.provider }}</span>
              <span class="course-duration">{{ course.duration }}</span>
            </div>
            <el-button type="primary" @click="openCourseLink(course.link)">观看课程</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElProgress, ElCollapse, ElCollapseItem, ElAvatar, ElButton } from 'element-plus'

// 面试官和候选人头像
const interviewerAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const candidateAvatar = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'

// 总体评价数据
const overallScore = ref(82)
// 核心指标数据
const coreIndicators = ref([
  { name: '专业知识水平', score: 88 },
  { name: '技能匹配度', score: 85 },
  { name: '语言表达能力', score: 82 },
  { name: '逻辑思维能力', score: 78 },
  { name: '应变抗压能力', score: 75 }
])
const aiEvaluation = ref(`候选人整体表现良好，专业知识扎实，尤其在${coreIndicators.value[0].name}方面表现突出。语言表达清晰流畅，逻辑思维能力较强。建议在${coreIndicators.value[3].name}和${coreIndicators.value[4].name}方面进一步提升，特别是在压力情境下的应变能力。`)

// 扇形图颜色
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 对话轮次数据
const conversationRounds = ref([
  {
    type: 'GREETING',
    score: 85,
    analysis: '自我介绍流畅自然，展现了教育背景和技术栈。建议可以更突出项目经验和核心竞争力。',
    indicators: [
      { name: '自信度', score: 82 },
      { name: '表达流畅度', score: 88 },
      { name: '内容完整性', score: 85 }
    ],
    dialogs: [
      { role: 'interviewer', message: '您好，请简单介绍一下自己。' },
      { role: 'candidate', message: '面试官您好，我是许战，中国矿业大学计算机科学与技术专业应届毕业生。主修Java开发技术栈，熟悉Spring Boot和MySQL，在校期间参与过3个企业级项目开发，曾获校级程序设计大赛二等奖。我的特点是学习能力强，最近三个月通过自学掌握了Redis和Docker的实战应用。' }
    ]
  },
  {
    type: 'BASIC',
    score: 87,
    analysis: '对多线程安全问题理解深刻，能结合具体场景分析，展现了扎实的Java基础。',
    indicators: [
      { name: '知识深度', score: 90 },
      { name: '回答准确性', score: 88 },
      { name: '举例恰当性', score: 83 }
    ],
    dialogs: [
      { role: 'interviewer', message: '请说明Java中如何保证多线程安全？' },
      { role: 'candidate', message: '在电商项目开发中，我们遇到过库存超卖问题。解决方案是：1) 使用synchronized修饰减库存方法；2) 采用Redis分布式锁处理集群环境；3) 最终改用乐观锁方案，在SQL中通过version字段控制："UPDATE product SET stock=stock-1, version=version+1 WHERE id=? AND version=?"。三种方案根据业务场景各有优劣，单机环境synchronized足够，分布式系统需要更完善的方案。' }
    ]
  },
  {
    type: 'RESUME',
    score: 83,
    analysis: '能清晰描述项目架构，建议补充更多技术难点和解决方案的细节。',
    indicators: [
      { name: '项目熟悉度', score: 85 },
      { name: '贡献描述', score: 80 },
      { name: '技术细节', score: 84 }
    ],
    dialogs: [
      { role: 'interviewer', message: '请详细介绍简历中的在线考试系统项目？' },
      { role: 'candidate', message: '我负责的模块是自动组卷系统，主要解决两个技术难点：1) 使用遗传算法实现智能组卷，将组卷时间从平均30秒优化到5秒内；2) 通过Redis缓存题库和试卷模板，QPS从200提升到1500。项目采用Spring Cloud架构，我独立完成了算法模块的接口设计和性能优化，最终系统支持了全校3万师生的在线考试需求。' }
    ]
  },
  {
    type: 'SCENARIO',
    score: 89,
    analysis: '系统故障处理方案完整，展现了清晰的应急思维和全链路排查能力。',
    indicators: [
      { name: '问题分析', score: 90 },
      { name: '解决方案', score: 88 },
      { name: '应变能力', score: 89 }
    ],
    dialogs: [
      { role: 'interviewer', message: '如果系统在高峰期崩溃，您会如何处理？' },
      { role: 'candidate', message: `Situation：在电商大促期间，订单服务突然不可用，每秒损失超万元。
Task：作为值班工程师，需在10分钟内恢复服务并保证数据一致性。
Action：1) 立即启动熔断机制，将流量切到降级页面；2) 通过APM工具定位到数据库连接池耗尽；3) 临时扩容连接池并重启服务；4) 补偿处理积压订单。
Result：15分钟内恢复核心功能，事后通过引入Hystrix和优化SQL，使系统抗住了后续流量高峰。这次经历让我养成了提前做压力测试的习惯。` }
    ]
  },
  {
    type: 'END',
    score: 90,
    analysis: '提问专业且有针对性，展现了良好的职业规划意识。',
    indicators: [
      { name: '礼仪表现', score: 92 },
      { name: '提问质量', score: 89 },
      { name: '整体印象', score: 90 }
    ],
    dialogs: [
      { role: 'interviewer', message: '您对我们公司还有什么想了解的吗？' },
      { role: 'candidate', message: '我想了解：1) 技术团队目前正在攻关的技术难点是什么？2) 对于应届生，公司有哪些培养机制？3) 这个岗位未来3年可能的发展路径是怎样的？这些信息将帮助我更好地规划职业发展。' }
    ]
  }
])

// 推荐课程数据
const recommendedCourses = ref([
  {
    title: 'Java高级编程与性能优化',
    description: '深入讲解Java高级特性与性能调优技巧',
    provider: 'B站 - 极客时间',
    duration: '8小时',
    image: 'https://pic1.zhimg.com/v2-3b4fc7e2a4745c29f9a6f62d4e8b8b6d_r.jpg',
    link: 'https://www.bilibili.com/video/BV1qJ411W7YR'
  },
  {
    title: '系统架构设计实战',
    description: '从零开始学习高并发系统架构设计',
    provider: 'B站 - 慕课网',
    duration: '12小时',
    image: 'https://pic1.zhimg.com/v2-3b4fc7e2a4745c29f9a6f62d4e8b8b6d_r.jpg',
    link: 'https://www.bilibili.com/video/BV1qJ411W7YR'
  },
  {
    title: '面试技巧与压力管理',
    description: '提升面试表现，掌握压力情境应对策略',
    provider: 'B站 - 网易云课堂',
    duration: '5小时',
    image: 'https://pic1.zhimg.com/v2-3b4fc7e2a4745c29f9a6f62d4e8b8b6d_r.jpg',
    link: 'https://www.bilibili.com/video/BV1qJ411W7YR'
  }
])

// 当前展开的对话轮次
const activeRound = ref(0)

// 根据分数获取等级
const getScoreLevel = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  if (score >= 60) return '及格'
  return '待提升'
}

// 根据分数获取进度条颜色
const getIndicatorColor = (score: number) => {
  if (score >= 85) return '#5cb87a'
  if (score >= 70) return '#1989fa'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 获取轮次类型名称
const getRoundTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    GREETING: '自我介绍',
    BASIC: '专业问题',
    RESUME: '简历提问',
    SCENARIO: '场景问题',
    END: '结束环节'
  }
  return typeNames[type] || type
}

// 打开课程链接
const openCourseLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style scoped>
.evaluation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h2 {
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

/* 总体评价样式 */
.overall-evaluation {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.evaluation-content {
  display: flex;
  gap: 30px;
}

.radar-chart {
  flex: 0 0 250px;
}

.evaluation-text {
  flex: 1;
}

.score-text {
  font-size: 28px;
  font-weight: bold;
  display: block;
  color: #303133;
}

.score-level {
  margin-top: 5px;
  font-size: 16px;
  color: #909399;
}

.indicator-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.indicator-item {
  margin-bottom: 10px;
}

.indicator-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.indicator-score {
  font-size: 12px;
  color: #909399;
  text-align: right;
  margin-top: 3px;
}

/* 对话轮次详情样式 */
.conversation-details {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.round-detail {
  display: flex;
  gap: 30px;
}

.round-chart {
  flex: 0 0 180px;
}

.round-analysis {
  flex: 1;
}

.round-indicators {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin: 15px 0;
}

.conversation-content {
  margin-top: 20px;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.dialog-bubble {
  display: flex;
  margin-bottom: 15px;
}

.dialog-avatar {
  margin-right: 15px;
}

.dialog-text {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  position: relative;
}

.dialog-role {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.dialog-message {
  line-height: 1.6;
}

.interviewer {
  background-color: #f2f6fc;
  margin-left: 60px;
}

.candidate {
  background-color: #ecf5ff;
  margin-right: 60px;
}

/* 推荐课程样式 */
.recommendations {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.course-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.course-info {
  padding: 15px;
}

.course-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.course-info p {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 15px;
}

.course-info .el-button {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .evaluation-content,
  .round-detail {
    flex-direction: column;
  }

  .indicator-grid,
  .round-indicators {
    grid-template-columns: 1fr;
  }

  .course-list {
    grid-template-columns: 1fr;
  }
}
</style>
