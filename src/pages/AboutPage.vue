<!-- 关于页，没登录默认进到这里，后续会修改美化 -->


<template>
  <div class="about-container">
    <div class="hero-section">
      <h1 class="title">AI面试助手</h1>
      <p class="subtitle">提升你的面试技能，开启职业新篇章</p>
      <el-button type="primary" size="large" class="start-button" @click="router.push('/login')">开始体验</el-button>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <el-icon class="feature-icon"><Document /></el-icon>
        <h3>简历优化</h3>
        <p>智能分析简历，提供专业修改建议</p>
      </div>
      <div class="feature-card">
        <el-icon class="feature-icon"><Microphone /></el-icon>
        <h3>口语练习</h3>
        <p>多语言口语训练，提升表达能力</p>
      </div>
      <div class="feature-card">
        <el-icon class="feature-icon"><DataAnalysis /></el-icon>
        <h3>能力评估</h3>
        <p>全方位分析，精准评估面试表现</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document, Microphone, DataAnalysis } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>



<script lang="ts">
  export default {
    name: 'AboutPage',
  }
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}

.hero-section {
  text-align: center;
  padding: 6rem 2rem;
  width: 100%;
}

.title {
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.subtitle {
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 2.5rem;
}

.start-button {
  padding: 12px 30px;
  font-size: 1.2rem;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  color: var(--el-color-primary);
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.2rem;
}

.feature-card p {
  color: #666;
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>
