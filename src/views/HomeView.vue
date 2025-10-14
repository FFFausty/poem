<template>
  <div class="home">
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
        <!-- 每日推荐 -->
        <section class="daily-recommendation">
          <h2>今日推荐</h2>
          <div class="poem-card" v-if="dailyPoem">
            <h3>{{ dailyPoem.title }}</h3>
            <p class="author">{{ dailyPoem.author }} · {{ dailyPoem.dynasty }}</p>
            <div class="content">
              <p v-for="line in dailyPoem.content.split('，')" :key="line">
                {{ line }}
              </p>
            </div>
            <div class="actions">
              <button class="btn btn-secondary">查看详情</button>
              <button class="btn btn-secondary">点赞</button>
            </div>
          </div>
        </section>

        <!-- 热门诗词 -->
        <section class="popular-poems">
          <h2>热门诗词</h2>
          <div class="poems-grid">
            <div v-for="poem in popularPoems" :key="poem.id" class="poem-item">
              <h4>{{ poem.title }}</h4>
              <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
              <p class="excerpt">{{ poem.content.substring(0, 30) }}...</p>
              <div class="stats">
                <span>👍 {{ poem.likes }}</span>
                <span>⭐ {{ poem.favorites }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '@/stores'
import type { Poem } from '@/stores'

const router = useRouter()
const poemStore = usePoemStore()

const searchKeyword = ref('')
const dailyPoem = ref<Poem | null>(null)
const popularPoems = ref<Poem[]>([])

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value }
    })
  }
}

onMounted(async () => {
  // 模拟数据
  dailyPoem.value = {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    tags: ['思乡', '月亮'],
    likes: 1234,
    favorites: 567,
    createdAt: '2024-01-01'
  }

  popularPoems.value = [
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
    },
    {
      id: 3,
      title: '登鹳雀楼',
      author: '王之涣',
      dynasty: '唐',
      content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
      tags: ['登高', '哲理'],
      likes: 765,
      favorites: 234,
      createdAt: '2024-01-01'
    }
  ]
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

.stats {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
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