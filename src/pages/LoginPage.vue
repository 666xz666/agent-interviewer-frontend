<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="left-section">
        <div class="welcome-text">
          <h1>欢迎使用 AI 面试助手</h1>
          <p>提升面试技能，开启职业新篇章</p>
        </div>
      </div>
      <div class="right-section">
        <div class="auth-box">
          <h2 class="title">AI面试助手</h2>
          <p class="subtitle">开启你的面试之旅</p>

          <el-tabs v-model="activeTab" class="auth-tabs">
            <el-tab-pane label="登录" name="login">
              <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="auth-form">
                <el-form-item prop="username">
                  <el-input
                    v-model="loginForm.username"
                    placeholder="用户名"
                    prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="密码"
                    prefix-icon="Lock"
                    show-password
                  />
                </el-form-item>

                <el-button type="primary" @click="handleLogin" :loading="loginLoading" class="submit-button">登录</el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="注册" name="register">
              <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="auth-form">
                <el-form-item prop="username">
                  <el-input
                    v-model="registerForm.username"
                    placeholder="用户名"
                    prefix-icon="User"
                  />
                </el-form-item>

                <el-form-item prop="email">
                  <el-input
                    v-model="registerForm.email"
                    placeholder="邮箱"
                    prefix-icon="Message"
                  />
                </el-form-item>

                <el-form-item prop="password">
                  <el-input
                    v-model="registerForm.password"
                    type="password"
                    placeholder="密码"
                    prefix-icon="Lock"
                    show-password
                  />
                </el-form-item>

                <el-form-item prop="confirmPassword">
                  <el-input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="确认密码"
                    prefix-icon="Lock"
                    show-password
                  />
                </el-form-item>

                <el-button type="primary" @click="handleRegister" :loading="registerLoading" class="submit-button">注册</el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginWithPassword, register } from '@/api/auth'

const router = useRouter()
const activeTab = ref('login')
const loginFormRef = ref()
const registerFormRef = ref()
const loginLoading = ref(false)
const registerLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.confirmPassword !== '') {
      if (registerFormRef.value) {
        registerFormRef.value.validateField('confirmPassword')
      }
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loginLoading.value = true
      try {
        await loginWithPassword(loginForm.username, loginForm.password)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
      } finally {
        loginLoading.value = false
      }
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      registerLoading.value = true
      try {
        await register({
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email
        })
        ElMessage.success('注册成功')
        activeTab.value = 'login'
        registerForm.username = ''
        registerForm.email = ''
        registerForm.password = ''
        registerForm.confirmPassword = ''
      } catch (error) {
        ElMessage.error('注册失败，请稍后重试')
      } finally {
        registerLoading.value = false
      }
    }
  })
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: #e0eafc;
  background: linear-gradient(to top right, #e0eafc, #cfdef3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}

.auth-content {
  width: 100%;
  max-width: 1400px;
  min-height: 900px;
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.left-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  padding: 3rem;
  border-radius: 20px 0 0 20px;
  position: relative;
  overflow: hidden;
}

.left-section::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: bubble-float 15s infinite ease-in-out;
}

.left-section::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -30px;
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: bubble-float 20s infinite ease-in-out 5s;
}

@keyframes bubble-float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(20px); }
}

.welcome-text {
  color: white;
  text-align: center;
  z-index: 1;
}

.welcome-text h1 {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.welcome-text p {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.auth-box {
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-bottom: 2.5rem;
}

:deep(.el-tabs__header) {
  margin-bottom: 25px;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 0 20px;
  color: #888;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item.is-active) {
  color: #185a9d;
}

:deep(.el-tabs__active-bar) {
  background-color: #43cea2;
  height: 3px;
}

.auth-form {
  margin-top: 1rem;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-input__wrapper) {
  padding: 8px 15px;
  border-radius: 8px;
  height: 48px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(67, 206, 162, 0.3);
}

.submit-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 992px) {
  .auth-content {
    flex-direction: column;
    width: 90%;
    min-height: auto;
    margin: 2rem 0;
  }

  .left-section {
    border-radius: 20px 20px 0 0;
    padding: 4rem 1rem;
  }

  .welcome-text h1 {
    font-size: 2.2rem;
  }
  .welcome-text p {
    font-size: 1.1rem;
  }

  .right-section {
    padding: 2rem 1.5rem;
  }
}
</style>
