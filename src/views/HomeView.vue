<template>
  <div class="csdn-grid">
    <aside class="card side left">
      <h3>分类</h3>
      <el-select v-model="category" placeholder="全部分类" clearable @change="load">
        <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
      </el-select>
      <h3 style="margin-top:12px;">标签</h3>
      <el-tag v-for="t in tags" :key="t" class="tag" @click="selectTag(t)">{{ t }}</el-tag>
      <el-button text @click="clearTag">清除标签</el-button>
    </aside>

    <section>
      <el-card v-for="a in list" :key="a.id" class="article" shadow="hover">
        <template #header>
          <div class="hd">
            <h2 @click="$router.push(`/article/${a.id}`)">{{ a.title }}</h2>
            <div>
              <el-tag size="small">{{ a.category }}</el-tag>
              <el-tag size="small" type="info" style="margin-left:6px;">{{ a.authorName }}</el-tag>
            </div>
          </div>
        </template>
        <p class="snippet">{{ a.content.slice(0, 160) }}...</p>
        <p><el-tag v-for="t in splitTags(a.tags)" :key="t" size="small" class="tag">{{ t }}</el-tag></p>
        <div class="ops">
          <el-button size="small" @click="$router.push(`/article/${a.id}`)">阅读全文</el-button>
          <el-button v-if="a.editable" size="small" @click="$router.push(`/editor/${a.id}`)">编辑</el-button>
          <el-button v-if="a.editable" size="small" type="danger" @click="remove(a.id)">删除</el-button>
        </div>
      </el-card>
    </section>

    <aside class="card side right">
      <h3>站点信息</h3>
      <p>游客可浏览和匿名评论。</p>
      <p>登录后可发布文章和管理草稿。</p>
      <p v-if="selectedTag">当前标签筛选：<b>{{ selectedTag }}</b></p>
    </aside>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import http from '../services/http'
import { ElMessage } from 'element-plus'

const list = ref([])
const categories = ref(['后端', '前端', '数据库', '架构', '随笔'])
const tags = ref(['SpringBoot', 'Vue3', 'ElementPlus', 'PostgreSQL', 'JWT'])
const category = ref('')
const selectedTag = ref('')

const splitTags = (s) => (s || '').split(',').map((i) => i.trim()).filter(Boolean)

async function load() {
  const params = {}
  if (category.value) params.category = category.value
  if (selectedTag.value) params.tag = selectedTag.value
  const { data } = await http.get('/articles', { params })
  list.value = data
}

function selectTag(t) { selectedTag.value = t; load() }
function clearTag() { selectedTag.value = ''; load() }

async function remove(id) {
  await http.delete(`/articles/${id}`)
  ElMessage.success('删除成功')
  await load()
}

onMounted(load)
</script>

<style scoped>
.side { padding: 14px; height: fit-content; }
.tag { margin-right: 6px; margin-bottom: 6px; cursor: pointer; }
.article { margin-bottom: 14px; }
.hd { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.hd h2 { margin: 0; cursor: pointer; font-size: 20px; }
.snippet { color: #4b5563; line-height: 1.8; }
.ops { display: flex; gap: 8px; }
</style>
