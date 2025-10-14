<template>
  <div class="search-view">
    <div class="container">
      <div class="search-header">
        <h1>诗词搜索</h1>
        <div class="search-controls">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="输入关键词搜索诗词..."
            @keyup.enter="performSearch"
          />
          <select v-model="searchType">
            <option value="all">全部</option>
            <option value="title">标题</option>
            <option value="author">作者</option>
            <option value="content">内容</option>
          </select>
          <button class="btn btn-primary" @click="performSearch">搜索</button>
        </div>
      </div>

      <div class="search-results">
        <div v-if="loading" class="loading">搜索中...</div>
        
        <div v-else-if="results.length === 0 && searchQuery" class="no-results">
          未找到相关诗词
        </div>

        <div v-else-if="results.length > 0" class="results-grid">
          <div 
            v-for="poem in results" 
            :key="poem.id" 
            class="poem-card"
            @click="viewPoemDetail(poem.id)"
          >
            <h3>{{ poem.title }}</h3>
            <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
            <p class="content-preview">{{ poem.content.substring(0, 50) }}...</p>
            <div class="poem-stats">
              <span>👍 {{ poem.likes }}</span>
              <span>⭐ {{ poem.favorites }}</span>
            </div>
          </div>
        </div>

        <div v-else class="search-tips">
          <h3>搜索提示</h3>
          <ul>
            <li>可以搜索诗词标题、作者名、诗句内容</li>
            <li>支持模糊搜索，输入部分关键词即可</li>
            <li>可以按朝代、体裁等条件筛选</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '@/stores'
import type { Poem } from '@/stores'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

const searchQuery = ref('')
const searchType = ref('all')
const results = ref<Poem[]>([])
const loading = ref(false)

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    performSearch()
  }
})

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    results.value = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        tags: ['思乡', '月亮'],
        likes: 1234,
        favorites: 567,
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        tags: ['春天', '自然'],
        likes: 890,
        favorites: 345,
        createdAt: '2024-01-01'
      }
    ]
    loading.value = false
  }, 500)
}

const viewPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}
</script>

<style scoped>
.search-view {
  padding: 40px 0;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.search-controls {
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.search-controls input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}

.search-controls select {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: white;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.poem-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.poem-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.poem-card .author {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.poem-card .content-preview {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.poem-stats {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.loading, .no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.search-tips {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
}

.search-tips h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.search-tips ul {
  list-style: none;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.search-tips li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>