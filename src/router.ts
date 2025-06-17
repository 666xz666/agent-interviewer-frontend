import { createRouter, createWebHistory } from 'vue-router'
import { loginWithSession } from '@/api/auth'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue')
  },
  {
    path: '/interview',
    name: 'interview',
    component: () => import('@/pages/InterviewPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('@/pages/ResumePage.vue')
  }
]

export const router = createRouter({
  routes,
  history: createWebHistory(),
})

// 全局前置守卫
router.beforeEach(async (to) => {
  // 如果是 API 路径或登录页面，直接放行
  if (to.path.startsWith('/api') || to.path.startsWith('/login')) {
    return true
  }

  try {
    // 尝试使用 session 登录
    await loginWithSession()

    return true
  } catch (error){
    console.log(error)

    // 登录失败，如果不是访问 about 页面，则重定向到 about
    if (to.path !== '/about') {
      return '/about'
    }

    return true
  }
})
