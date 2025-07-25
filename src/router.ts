import { createRouter, createWebHistory } from 'vue-router'
import { loginWithSession } from '@/api/auth'
import { ElMessage } from 'element-plus'
import MainLayout from '@/layouts/MainLayout.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'




const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/AboutPage.vue')
  },
   {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue')
      },
      {
        path: '/resume',
        name: 'Resume',
        component: () => import('@/pages/Resume.vue')
      },
      {
        path: '/interview',
        name: 'Interview',
        component: () => import('@/pages/InterviewPage.vue')
      },
      {
        path: '/history',
        name: 'History',
        component: () => import('@/pages/HistoryPage.vue')
      },
      {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/pages/Analysis.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue')
      },
      {
        path: '/resume/create',
        name: 'ResumeCreate',
        component: () => import('@/pages/ResumeCreate.vue')
      },
      {
        path: '/interview/create',
        name: 'CreateInterview',
        component: () => import('@/pages/CreateInterview.vue')
      },
      {
        path: '/exercise',
        name: 'Exercise',
        component: () => import('@/pages/ExercisePage.vue')
      },
      {
        path: '/interview/evaluation/',
        name: 'InterviewEvaluation',
        component: () => import('@/pages/InterviewEvaluationPage.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue')
  },
  // {
  //   path: '/interview',
  //   name: 'interview',
  //   component: () => import('@/pages/InterviewPage.vue')
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/resumeEdit/:resumeId',  // 保持不变，因为已经使用 :resumeId
    name: 'resumeEdit',
    component: () => import('@/pages/ResumeEditPage.vue')
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('@/pages/Dashboard.vue')
  // },
  // {
  //   path: '/resume',
  //   name: 'Resume',
  //   component: () => import('@/pages/Resume.vue')
  // },
  // {
  //   path: '/interview',
  //   name: 'Interview',
  //   component: () => import('@/pages/InterviewPage.vue')
  // },
  // {
  //   path: '/history',
  //   name: 'History',
  //   component: () => import('@/pages/History.vue')
  // },

  {
    path: '/mainlayout',
    name: 'MainLayout',
    component: () => import('@/pages/MainLayout.vue')
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
    await loginWithSession();
    return true
  } catch (error){
    ElMessage.error('Session 无效或已过期，请重新登录');

    // 登录失败，如果不是访问 about 页面，则重定向到 about
    if (to.path !== '/') {
      return '/'
    }
    return true

  }
})
