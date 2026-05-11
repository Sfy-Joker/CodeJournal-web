<template>
  <el-card>
    <template #header><b>用户中心 - 我的文章</b></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="已发布" name="published" />
      <el-tab-pane label="草稿" name="draft" />
    </el-tabs>
    <el-table :data="filtered" style="width:100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="updatedAt" label="更新时间" width="220">
        <template #default="scope">{{ new Date(scope.row.updatedAt).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="$router.push(`/editor/${scope.row.id}`)">编辑</el-button>
          <el-button v-if="!scope.row.draft" size="small" @click="$router.push(`/article/${scope.row.id}`)">查看</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import http from '../services/http'

const tab = ref('published')
const list = ref([])
const filtered = computed(() => list.value.filter(i => tab.value === 'draft' ? i.draft : !i.draft))

async function load() {
  const { data } = await http.get('/articles/mine')
  list.value = data
}

async function remove(id) {
  await http.delete(`/articles/${id}`)
  ElMessage.success('删除成功')
  await load()
}

onMounted(load)
</script>
