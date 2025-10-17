<template>
  <div class="home">
    <NavBar />
    <header class="hero-section">
      <div class="container">
        <h1 class="hero-title">诗词赏析</h1>
        <p class="hero-subtitle">传承中华文化，品味诗词之美</p>
        <div class="search-box">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索诗词、作者或诗句..."
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-primary" @click="handleSearch">搜索</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-section">
          <div class="loading-spinner"></div>
          <p>正在加载诗词数据...</p>
        </div>

        <!-- 每日推荐 -->
        <section class="daily-recommendation" v-if="!loading && dailyPoem">
          <h2>今日推荐</h2>
          <div class="poem-card">
            <h3>{{ dailyPoem.title }}</h3>
            <p class="author">{{ dailyPoem.author }} · {{ dailyPoem.dynasty }}</p>
            <div class="content">
              <p v-for="line in dailyPoem.content.split('，')" :key="line">
                {{ line }}
              </p>
            </div>
            <div class="stats">
              <span class="like-count">👍 {{ dailyPoem.likes || 0 }} 点赞</span>
              <span class="favorite-count">⭐ {{ dailyPoem.favorites || 0 }} 收藏</span>
            </div>
            <div class="actions">
              <button 
                class="btn btn-primary"
                @click="router.push(`/poem/${dailyPoem.id}`)"
              >
                查看详情
              </button>
            </div>
          </div>
        </section>

        <!-- 热门诗词 -->
        <section class="popular-poems" v-if="!loading && popularPoems.length > 0">
          <h2>热门诗词</h2>
          <div class="poems-grid">
            <div 
              v-for="poem in popularPoems" 
              :key="poem.id" 
              class="poem-item"
              @click="router.push(`/poem/${poem.id}`)"
            >
              <h4>{{ poem.title }}</h4>
              <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
              <p class="excerpt">{{ poem.content.substring(0, 30) }}...</p>
              <div class="stats">
                <span class="like-count">👍 {{ poem.likes || 0 }}</span>
                <span class="favorite-count">⭐ {{ poem.favorites || 0 }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 空状态 -->
        <section class="empty-state" v-if="!loading && popularPoems.length === 0">
          <h2>暂无诗词数据</h2>
          <p>当前还没有诗词内容，请稍后再试</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '@/stores'
import type { Poem } from '@/lib/supabase'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const poemStore = usePoemStore()

const searchKeyword = ref('')
const dailyPoem = ref<Poem | null>(null)
const popularPoems = ref<Poem[]>([])
const loading = ref(true)

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value }
    })
  }
}

// 加载真实数据
const loadRealData = async () => {
  try {
    loading.value = true
    
    // 获取随机诗词作为每日推荐
    const randomPoem = await poemStore.fetchRandomPoem()
    dailyPoem.value = randomPoem
    
    // 获取热门诗词（按点赞数排序）
    await poemStore.fetchPoems({ 
      limit: 6,
      page: 1 
    })
    popularPoems.value = poemStore.poems
    
  } catch (error) {
    console.error('加载首页数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRealData()
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-box {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 10px;
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.main-content {
  padding: 60px 0;
}

section {
  margin-bottom: 60px;
}

section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
  border-left: 4px solid var(--primary-color);
  padding-left: 1rem;
}

.poem-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.poem-card h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.poem-card .author {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-style: italic;
}

.poem-card .content {
  font-size: 1.1rem;
  line-height: 2;
  margin-bottom: 2rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.poem-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.poem-item:hover {
  transform: translateY(-2px);
}

.poem-item h4 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.poem-item .author {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.poem-item .excerpt {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.loading-section {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.poem-card .stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.poem-card .like-count,
.poem-card .favorite-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.like-count {
  color: #e74c3c;
}

.favorite-count {
  color: #f39c12;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
}
</style>