<template>
  <div class="settings-section">
    <h2>系统设置</h2>
    <el-form :model="form" label-width="120px" class="settings-form">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="通知设置">
        <el-switch v-model="form.notification" />
      </el-form-item>
      <el-form-item label="主题颜色">
        <el-color-picker v-model="form.themeColor" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存设置</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const form = ref({
  username: '用户',
  email: 'user@example.com',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  notification: true,
  themeColor: '#409EFF'
})

const handleAvatarSuccess = (response) => {
  form.value.avatar = response.url
  ElMessage.success('头像上传成功')
}

const onSubmit = () => {
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.settings-section {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.settings-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.settings-form {
  max-width: 600px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
