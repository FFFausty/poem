<template>
  <div class="author-introduction">
    <NavBar />
    <div class="container">
      <div class="page-header">
        <h1>诗人介绍</h1>
        <p class="page-subtitle">了解历代著名诗人的生平与成就</p>
      </div>

      <!-- 诗人搜索 -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索诗人姓名..."
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-primary" @click="handleSearch">搜索</button>
        </div>
      </div>

      <!-- 朝代筛选 -->
      <div class="dynasty-filter">
        <h2>按朝代浏览</h2>
        <div class="dynasty-tags">
          <button 
            v-for="dynasty in dynasties" 
            :key="dynasty"
            class="dynasty-tag"
            :class="{ active: selectedDynasty === dynasty }"
            @click="filterByDynasty(dynasty)"
          >
            {{ dynasty }}
          </button>
        </div>
      </div>

      <!-- 诗人列表 -->
      <div class="authors-grid">
        <div 
          v-for="author in filteredAuthors" 
          :key="author.id"
          class="author-card"
          @click="showAuthorDetail(author)"
        >
          <div class="author-avatar">
            <img 
              :src="author.avatar" 
              :alt="author.name"
              class="avatar-image"
            />
          </div>
          <div class="author-info">
            <h3 class="author-name">{{ author.name }}</h3>
            <p class="author-dynasty">{{ author.dynasty }}</p>
            <p class="author-desc">{{ author.description }}</p>
            <div class="author-stats">
              <span class="poem-count">作品: {{ author.poemCount }} 首</span>
              <span class="popularity">人气: {{ author.popularity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredAuthors.length === 0" class="empty-state">
        <h3>暂无相关诗人</h3>
        <p>请尝试其他搜索条件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'

// 诗人数据
const authors = ref([
  {
    id: 1,
    name: '李白',
    dynasty: '唐',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/8dffa57897e12c1023bcf70a26df9333.jpg',
    description: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    poemCount: 1010,
    popularity: '极高'
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/b1a6adaa941787143bde660b2a7cd0bb.jpg',
    description: '唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
    poemCount: 1400,
    popularity: '极高'
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/3a46c44c2389f96fe5fb81f90a516ca0.jpg',
    description: '北宋文学家、书画家，豪放派词人代表。',
    poemCount: 2700,
    popularity: '极高'
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/9dbe0bb6d0219e483bacd5befd426f58.jpg',
    description: '宋代著名女词人，婉约派代表，有"千古第一才女"之称。',
    poemCount: 87,
    popularity: '高'
  },
  {
    id: 5,
    name: '白居易',
    dynasty: '唐',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/da2917af9d4826201c10f3ad77111919.jpg',
    description: '唐代伟大的现实主义诗人，新乐府运动的倡导者。',
    poemCount: 2800,
    popularity: '高'
  },
  {
    id: 6,
    name: '王维',
    dynasty: '唐',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/7715071621e0f08f81db8fb6d714dabd.jpg',
    description: '唐代著名诗人、画家，有"诗佛"之称。',
    poemCount: 400,
    popularity: '高'
  }
])

// 朝代列表
const dynasties = ref(['全部', '唐', '宋', '元', '明', '清', '现代'])

// 搜索和筛选状态
const searchKeyword = ref('')
const selectedDynasty = ref('全部')

// 过滤后的诗人列表
const filteredAuthors = computed(() => {
  let result = authors.value

  // 按朝代筛选
  if (selectedDynasty.value !== '全部') {
    result = result.filter(author => author.dynasty === selectedDynasty.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(author => 
      author.name.toLowerCase().includes(keyword) ||
      author.description.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在computed中实现
  console.log('搜索关键词:', searchKeyword.value)
}

// 按朝代筛选
const filterByDynasty = (dynasty: string) => {
  selectedDynasty.value = dynasty
}

// 显示诗人详情
const showAuthorDetail = (author: any) => {
  // 这里可以跳转到诗人详情页面或显示模态框
  console.log('查看诗人详情:', author.name)
  // 实际实现中可以使用 router.push 或显示模态框
}

onMounted(() => {
  console.log('诗人介绍页面加载完成')
})
</script>

<style scoped>
.author-introduction {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
}

.page-header h1 {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 300;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.search-section {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: 10px;
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}

.dynasty-filter {
  margin-bottom: 40px;
}

.dynasty-filter h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.dynasty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dynasty-tag {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dynasty-tag:hover,
.dynasty-tag.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  gap: 15px;
}

.author-card:hover {
  transform: translateY(-2px);
}

.author-avatar {
  flex-shrink: 0;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.author-dynasty {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author-desc {
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.author-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-secondary);
}

.empty-state h3 {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .authors-grid {
    grid-template-columns: 1fr;
  }
  
  .author-card {
    flex-direction: column;
    text-align: center;
  }
  
  .author-avatar {
    align-self: center;
  }
  
  .author-stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>