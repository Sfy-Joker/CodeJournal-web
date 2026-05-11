<template>
  <el-container>
    <el-header class="topbar">
      <div class="inner container">
        <div class="logo" @click="$router.push('/')">代码日志</div>
        <div class="actions">
          <template v-if="auth.isLoggedIn">
            <el-button type="primary" plain @click="$router.push('/editor')">写文章</el-button>
            <el-button @click="$router.push('/me')">用户中心</el-button>
            <el-dropdown>
              <span class="el-dropdown-link">{{ auth.username }}</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button text @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </el-header>
    <el-main class="container"><RouterView /></el-main>
  </el-container>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
function logout() { auth.logout(); router.push('/') }
</script>

<style scoped>
.topbar { background: #fff; border-bottom: 1px solid var(--border); }
.inner { display: flex; align-items: center; justify-content: space-between; height: 100%; }
.logo { font-size: 22px; font-weight: 700; cursor: pointer; }
.actions { display: flex; gap: 12px; align-items: center; }
</style>
