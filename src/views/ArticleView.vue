<template>
  <div class="card detail">
    <h1>{{ article.title }}</h1>
    <p class="meta">作者：{{ article.authorName }} · 分类：{{ article.category }} · {{ fmt(article.createdAt) }}</p>
    <p><el-tag v-for="t in splitTags(article.tags)" :key="t" size="small" class="tag">{{ t }}</el-tag></p>
    <div class="content">{{ article.content }}</div>

    <el-divider />
    <h3>评论区（匿名可用）</h3>
    <el-form @submit.prevent="submitComment()">
      <el-form-item><el-input v-model="comment.nickname" placeholder="昵称" maxlength="50" /></el-form-item>
      <el-form-item><el-input v-model="comment.content" type="textarea" :rows="4" placeholder="说点什么..." maxlength="2000" /></el-form-item>
      <el-button type="primary" @click="submitComment()">发表评论</el-button>
    </el-form>

    <div v-for="c in comments" :key="c.id" class="comment-item">
      <p><b>{{ c.nickname }}</b> · {{ fmt(c.createdAt) }}</p>
      <p>{{ c.content }}</p>
      <el-button size="small" text @click="toggleReply(c.id)">回复</el-button>
      <div v-if="replyingId === c.id" class="reply-box">
        <el-input v-model="reply.nickname" placeholder="昵称" />
        <el-input v-model="reply.content" type="textarea" :rows="3" placeholder="回复内容" />
        <el-button size="small" type="primary" @click="submitReply(c.id)">提交回复</el-button>
      </div>
      <div class="replies" v-if="c.replies && c.replies.length">
        <div class="reply" v-for="r in c.replies" :key="r.id">
          <p><b>{{ r.nickname }}</b> · {{ fmt(r.createdAt) }}</p>
          <p>{{ r.content }}</p>
        </div>
      </div>
      <el-divider />
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="page + 1"
      @current-change="onPageChange"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import http from '../services/http'
import { ElMessage } from 'element-plus'

const route = useRoute()
const article = ref({})
const comments = ref([])
const total = ref(0)
const page = ref(0)
const size = ref(8)
const comment = reactive({ nickname: '', content: '' })
const reply = reactive({ nickname: '', content: '' })
const replyingId = ref(null)

const fmt = (v) => (v ? new Date(v).toLocaleString() : '')
const splitTags = (s) => (s || '').split(',').map((i) => i.trim()).filter(Boolean)

async function loadArticle() {
  const { data } = await http.get(`/articles/${route.params.id}`)
  article.value = data
}

async function loadComments() {
  const { data } = await http.get(`/articles/${route.params.id}/comments`, { params: { page: page.value, size: size.value } })
  comments.value = data.list
  total.value = data.total
}

async function submitComment() {
  if (!comment.nickname || !comment.content) return ElMessage.warning('请填写昵称和评论内容')
  await http.post(`/articles/${route.params.id}/comments`, comment)
  comment.nickname = ''
  comment.content = ''
  ElMessage.success('评论成功')
  await loadComments()
}

function toggleReply(id) {
  replyingId.value = replyingId.value === id ? null : id
}

async function submitReply(parentId) {
  if (!reply.nickname || !reply.content) return ElMessage.warning('请填写回复内容')
  await http.post(`/articles/${route.params.id}/comments`, { ...reply, parentId })
  reply.nickname = ''
  reply.content = ''
  replyingId.value = null
  ElMessage.success('回复成功')
  await loadComments()
}

function onPageChange(p) {
  page.value = p - 1
  loadComments()
}

onMounted(async () => {
  await loadArticle()
  await loadComments()
})
</script>

<style scoped>
.detail { padding: 22px; }
.meta { color: #6b7280; }
.content { white-space: pre-wrap; line-height: 1.9; font-size: 16px; }
.tag { margin-right: 6px; }
.comment-item { margin-top: 12px; }
.reply-box { margin: 8px 0; }
.replies { margin-left: 20px; border-left: 2px solid #e5e7eb; padding-left: 10px; }
</style>
