<!-- 用户主导航栏，登录后进入 -->

<template>
  <div>
    <h1>HomePage</h1>
    <el-button type="primary" size="large" class="start-button" @click="router.push('/about')">开始体验</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<script lang="ts">
  export default {
    name: 'HomePage',
  }

</script>


<style>

</style>
