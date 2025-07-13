<template>
  <el-menu
    active-text-color="#3e8ef7"
    background-color="#f5f7fa"
    class="el-menu-vertical"
    :default-active="activeMenu"
    text-color="#606266"
    @select="handleSelect"
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <el-menu-item index="/dashboard">
      <el-icon><House /></el-icon>
      <template #title>控制面板</template>
    </el-menu-item>
    <el-menu-item index="/resume">
      <el-icon><Document /></el-icon>
      <template #title>简历管理</template>
    </el-menu-item>
    <el-menu-item index="/interview">
      <el-icon><ChatLineRound /></el-icon>
      <template #title>模拟面试</template>
    </el-menu-item>
    <el-menu-item index="/history">
      <el-icon><DataLine /></el-icon>
      <template #title>面试历史</template>
    </el-menu-item>
    <el-menu-item index="/analysis">
      <el-icon><PieChart /></el-icon>
      <template #title>能力分析</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon><Setting /></el-icon>
      <template #title>系统设置</template>
    </el-menu-item>

  </el-menu>
</template>

<script setup lang="ts">
import {
  House,
  Document,
  ChatLineRound,
  DataLine,
  PieChart,
  Setting
} from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path)
const isCollapse = ref(false)

watch(route, (newRoute) => {
  activeMenu.value = newRoute.path
})

const handleSelect = (key) => {
  activeMenu.value = key
  router.push(key)
}
</script>

<style scoped>
.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  transition: all 0.3s;
}

.el-menu-item:hover {
  background-color: #f5f7fa;
}

.el-menu-item.is-active {
  background-color: #eef2ff;
  color: #3e8ef7;
}

.el-menu-item.is-active .el-icon {
  color: #3e8ef7;
}

.el-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
