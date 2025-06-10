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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}


@keyframes background-pan {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.about-container {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  color: #333;
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  width: 100%;
  animation: fadeIn 1s ease-out forwards;
}

.title {
  font-size: 4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  color: #555;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.start-button {
  border-radius: 50px;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
}

.start-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(0, 123, 255, 0.3);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transform: translateY(20px);
  animation: fadeIn 0.6s ease-out ;
  animation-delay: calc(0.25s * var(--i, 1));
  transition: opacity 0.6s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-in-out;
}

.feature-card:nth-child(1) { --i: 1; }
.feature-card:nth-child(2) { --i: 2; }
.feature-card:nth-child(3) { --i: 3; }

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 40px rgba(31, 38, 135, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  background: var(--el-color-primary);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #666;
  line-height: 1.7;
  font-size: 1rem;
  font-weight: 300;
}
</style>
