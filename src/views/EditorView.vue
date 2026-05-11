<template>
  <el-card>
    <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
    <el-form @submit.prevent="submit">
      <el-form-item><el-input v-model="form.title" placeholder="标题" /></el-form-item>
      <el-form-item>
        <el-select v-model="form.category" placeholder="分类">
          <el-option label="后端" value="后端" />
          <el-option label="前端" value="前端" />
          <el-option label="数据库" value="数据库" />
          <el-option label="架构" value="架构" />
          <el-option label="随笔" value="随笔" />
        </el-select>
      </el-form-item>
      <el-form-item><el-input v-model="form.tags" placeholder="标签，逗号分隔，如 Vue3,ElementPlus" /></el-form-item>
      <el-form-item><el-input v-model="form.content" type="textarea" :rows="12" placeholder="内容" /></el-form-item>
      <el-form-item><el-switch v-model="form.draft" active-text="保存为草稿" /></el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form>
  </el-card>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '../services/http'

const route = useRoute()
const router = useRouter()
const form = reactive({ title: '', content: '', category: '后端', tags: '默认', draft: false })
const isEdit = computed(() => !!route.params.id)

async function load() {
  if (!isEdit.value) return
  const { data } = await http.get(`/articles/${route.params.id}`)
  Object.assign(form, data)
}

async function submit() {
  try {
    if (!form.title.trim() || !form.content.trim()) {
      ElMessage.warning('标题和内容不能为空')
      return
    }
    if (!form.category.trim() || !form.tags.trim()) {
      ElMessage.warning('分类和标签不能为空')
      return
    }
    if (isEdit.value) await http.put(`/articles/${route.params.id}`, form)
    else await http.post('/articles', form)
    ElMessage.success('保存成功')
    router.push('/me')
  } catch (e) {
    ElMessage.error(e?.response?.data?.message || '保存失败')
  }
}

onMounted(load)
</script>
