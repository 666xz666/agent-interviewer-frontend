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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-content {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
}

.left-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #2c3e50 0%, #3498db 100%);
  padding: 2rem;
}

.welcome-text {
  color: white;
  text-align: center;
}

.welcome-text h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.welcome-text p {
  font-size: 1.5rem;
  opacity: 0.9;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-box {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
}

.auth-tabs {
  margin-top: 1rem;
}

.auth-form {
  margin-top: 2rem;
}

.submit-button {
  width: 100%;
  padding: 12px;
  margin-top: 1rem;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}

:deep(.el-input__wrapper) {
  padding: 12px;
}

:deep(.el-input__inner) {
  height: 40px;
}

@media (max-width: 768px) {
  .auth-content {
    flex-direction: column;
  }

  .left-section {
    padding: 2rem 1rem;
  }

  .welcome-text h1 {
    font-size: 2rem;
  }

  .welcome-text p {
    font-size: 1.2rem;
  }

  .right-section {
    padding: 1rem;
  }

  .auth-box {
    padding: 20px;
  }
}
</style>
