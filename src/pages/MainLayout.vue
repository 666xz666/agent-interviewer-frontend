<template>
  <div class="main-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar" :class="{ 'collapsed': isCollapse }">
      <div class="logo-area">
        <h2 v-show="!isCollapse">智能面试系统</h2>
        <h2 v-show="isCollapse">智</h2>
      </div>
      <Asider :is-collapse="isCollapse" />
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="header-fixed">
        <div class="header">
          <div class="header-left">
            <el-button
              type="text"
              @click="toggleCollapse"
              class="menu-toggle"
            >
              <el-icon>
                <component :is="isCollapse ? ArrowRight : ArrowLeft" />
              </el-icon>
            </el-button>
            <h2 class="page-title">{{ getPageTitle }}</h2>
          </div>
          <div class="user-info">
            <el-avatar :size="40" :src="userAvatar" />
            <span class="username">{{ userName }}</span>
            <el-dropdown trigger="click">
              <el-icon style="margin-left: 8px; cursor: pointer">
                <ArrowDown />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import Asider from './AsiderBar.vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const userName = ref('游客')
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const getPageTitle = computed(() => {
  const titleMap = {
    '/dashboard': '控制面板',
    '/resume': '简历管理',
    '/interview': '模拟面试',
    '/history': '面试历史',
    '/analysis': '能力分析',
    '/settings': '系统设置'
  }
  return titleMap[route.path] || '智能面试系统'
})

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.sidebar {
  width: 220px;
  height: 100vh;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  transition: width 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
  z-index: 1;
}

.sidebar.collapsed {
  width: 64px;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
}

.logo-area h2 {
  color: #1890ff;
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.header-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  height: 60px;
  z-index: 100;
  transition: left 0.3s ease;
}

.sidebar.collapsed ~ .main-content .header-fixed {
  left: 64px;
}

.header {
  height: 100%;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  margin-right: 16px;
  font-size: 16px;
}

.page-title {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: #f0f2f5;
  margin-top: 60px; /* 为固定头部留出空间 */
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
