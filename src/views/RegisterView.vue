<template>
  <el-card class="auth-card">
    <h2>注册代码日志</h2>
    <el-form @submit.prevent="submit">
      <el-form-item><el-input v-model="form.username" placeholder="用户名(3-30)" /></el-form-item>
      <el-form-item><el-input v-model="form.password" type="password" placeholder="密码(至少6位)" show-password /></el-form-item>
      <el-button type="primary" @click="submit">注册</el-button>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '../services/http'
import { useAuthStore } from '../stores/auth'

const form = reactive({ username: '', password: '' })
const router = useRouter()
const auth = useAuthStore()

async function submit() {
  try {
    const { data } = await http.post('/auth/register', form)
    auth.setAuth(data.token, data.username)
    ElMessage.success('注册成功')
    router.push('/')
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || '注册失败')
  }
}
</script>

<style scoped>.auth-card{max-width:420px;margin:40px auto;}</style>
