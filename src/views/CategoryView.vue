<template>
  <div class="category-view">
    <NavBar />
    <div class="container">
      <div class="category-header">
        <h1>诗词分类</h1>
        <p class="subtitle">按朝代、体裁、主题等分类浏览诗词</p>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filters">
        <div class="filter-group">
          <h3>按朝代</h3>
          <div class="filter-tags">
            <button 
              v-for="dynasty in dynasties" 
              :key="dynasty"
              :class="['filter-tag', { active: selectedDynasty === dynasty }]"
              @click="toggleDynasty(dynasty)"
            >
              {{ dynasty }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>按体裁</h3>
          <div class="filter-tags">
            <button 
              v-for="genre in genres" 
              :key="genre"
              :class="['filter-tag', { active: selectedGenre === genre }]"
              @click="toggleGenre(genre)"
            >
              {{ genre }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3>按主题</h3>
          <div class="filter-tags">
            <button 
              v-for="theme in themes" 
              :key="theme"
              :class="['filter-tag', { active: selectedTheme === theme }]"
              @click="toggleTheme(theme)"
            >
              {{ theme }}
            </button>
          </div>
        </div>
      </div>

      <!-- 分类结果 -->
      <div class="category-results">
        <div v-if="filteredPoems.length === 0" class="no-results">
          <p>暂无符合条件的诗词</p>
          <button class="btn btn-primary" @click="clearFilters">清除筛选条件</button>
        </div>

        <div v-else class="results-section">
          <div class="results-header">
            <h2>搜索结果 ({{ filteredPoems.length }} 首)</h2>
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="likes">按热度</option>
                <option value="title">按标题</option>
                <option value="author">按作者</option>
              </select>
            </div>
          </div>

          <div class="poems-grid">
            <div 
              v-for="poem in sortedPoems" 
              :key="poem.id" 
              class="poem-card"
              @click="viewPoemDetail(poem.id)"
            >
              <div class="poem-header">
                <h3>{{ poem.title }}</h3>
                <span class="dynasty-badge">{{ poem.dynasty }}</span>
              </div>
              <p class="author">{{ poem.author }}</p>
              <p class="content-preview">{{ poem.content.substring(0, 60) }}...</p>
              <div class="poem-footer">
                <div class="poem-stats">
                  <span class="stat">
                    <i class="fas fa-heart"></i>
                    {{ poem.likes }}
                  </span>
                  <span class="stat">
                    <i class="fas fa-bookmark"></i>
                    {{ poem.favorites }}
                  </span>
                </div>
                <div class="poem-tags">
                  <span 
                    v-for="tag in poem.tags.slice(0, 2)" 
                    :key="tag" 
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import poemsData from '@/data/poems.json'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()

// 筛选条件
const selectedDynasty = ref('')
const selectedGenre = ref('')
const selectedTheme = ref('')
const sortBy = ref('likes')

// 分类数据
const dynasties = ['唐', '宋', '元', '明', '清', '先秦', '汉', '魏晋']
const genres = ['诗', '词', '曲', '赋', '乐府', '绝句', '律诗']
const themes = ['爱情', '思乡', '山水', '边塞', '咏物', '怀古', '送别', '田园']

// 诗词数据
const poems = ref<any[]>([])

onMounted(() => {
  poems.value = poemsData.poems
})

// 筛选后的诗词
const filteredPoems = computed(() => {
  return poems.value.filter(poem => {
    const matchesDynasty = !selectedDynasty.value || poem.dynasty === selectedDynasty.value
    const matchesGenre = !selectedGenre.value || poem.genre === selectedGenre.value
    const matchesTheme = !selectedTheme.value || 
      (poem.tags && poem.tags.includes(selectedTheme.value))
    
    return matchesDynasty && matchesGenre && matchesTheme
  })
})

// 排序后的诗词
const sortedPoems = computed(() => {
  return [...filteredPoems.value].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      case 'likes':
      default:
        return b.likes - a.likes
    }
  })
})

// 筛选操作
const toggleDynasty = (dynasty: string) => {
  selectedDynasty.value = selectedDynasty.value === dynasty ? '' : dynasty
}

const toggleGenre = (genre: string) => {
  selectedGenre.value = selectedGenre.value === genre ? '' : genre
}

const toggleTheme = (theme: string) => {
  selectedTheme.value = selectedTheme.value === theme ? '' : theme
}

const clearFilters = () => {
  selectedDynasty.value = ''
  selectedGenre.value = ''
  selectedTheme.value = ''
}

const viewPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}
</script>

<style scoped>
.category-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-header {
  text-align: center;
  margin-bottom: 40px;
}

.category-header h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'SimSun', serif;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.category-filters {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-group {
  margin-bottom: 25px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group h3 {
  font-size: 1.3rem;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: 600;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-tag:hover {
  border-color: #3498db;
  color: #3498db;
}

.filter-tag.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.category-results {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.no-results p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.results-header h2 {
  color: #2c3e50;
  font-size: 1.8rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.poem-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3498db;
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.poem-header h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin: 0;
  font-family: 'SimSun', serif;
}

.dynasty-badge {
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.author {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 10px;
  font-style: italic;
}

.content-preview {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.stat i {
  font-size: 0.8rem;
}

.poem-tags {
  display: flex;
  gap: 5px;
}

.tag {
  background: #ecf0f1;
  color: #7f8c8d;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .filter-tags {
    justify-content: center;
  }
}
</style>