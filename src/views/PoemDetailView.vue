<template>
  <div class="poem-detail">
    <NavBar />
    <div class="container">
      <div class="poem-header">
        <h1>{{ poem?.title }}</h1>
        <p class="author-info">{{ poem?.author }} · {{ poem?.dynasty }}</p>
      </div>

      <div class="poem-content">
        <div class="original-text">
          <h3>原文</h3>
          <div class="text-content">
            <p v-for="line in poem?.content.split('，')" :key="line" class="poem-line">
              {{ line }}
            </p>
          </div>
        </div>

        <div class="annotations" v-if="poem?.annotations">
          <h3>注解</h3>
          <ul>
            <li v-for="annotation in poem.annotations" :key="annotation">
              {{ annotation }}
            </li>
          </ul>
        </div>

        <div class="translation" v-if="poem?.translation">
          <h3>译文</h3>
          <p>{{ poem.translation }}</p>
        </div>

        <div class="appreciation" v-if="poem?.appreciation">
          <h3>赏析</h3>
          <p>{{ poem.appreciation }}</p>
        </div>
      </div>

      <div class="poem-actions">
        <button 
          :class="['btn', isLiked ? 'btn-liked' : 'btn-primary']" 
          @click="handleLike"
          :disabled="isLoading"
        >
          {{ isLiked ? '❤️' : '👍' }} {{ isLiked ? '已点赞' : '点赞' }} ({{ poem?.likes || 0 }})
        </button>
        <button class="btn btn-secondary" @click="handleFavorite">
          ⭐ 收藏 ({{ poem?.favorites || 0 }})
        </button>
        <button class="btn btn-secondary" @click="handleShare">
          📤 分享
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore, useUserStore } from '@/stores'
import type { Poem } from '@/lib/supabase'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()
const userStore = useUserStore()

const poem = ref<Poem | null>(null)
const isLiked = ref(false)
const isLoading = ref(false)

onMounted(async () => {
  const poemId = parseInt(route.params.id as string)
  
  try {
    // 获取诗词详情
    const poemData = await poemStore.fetchPoemById(poemId)
    poem.value = poemData
    
    // 检查用户是否已点赞
    if (userStore.isLoggedIn) {
      const likeStatus = await poemStore.checkUserLike(poemId)
      isLiked.value = likeStatus.liked
    }
  } catch (error) {
    console.error('获取诗词详情失败:', error)
    // 模拟数据（备用）
    poem.value = {
      id: poemId,
      title: '静夜思',
      author: '李白',
      dynasty: '唐',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      category: '诗',
      tags: ['思乡', '月亮'],
      analysis: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。后两句通过动作神态的刻画，深化思乡之情。',
      likes: 1234,
      favorites: 567,
      image: '',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }
  }
})

const handleLike = async () => {
  if (!poem.value) return
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  try {
    console.log('开始点赞操作')
    isLoading.value = true
    const result = await poemStore.likePoem(poem.value.id)
    isLiked.value = result.liked
    poem.value.likes = result.likes
    console.log('点赞操作成功', result)
  } catch (error: any) {
    console.error('点赞操作失败:', error)
    alert(error.message || '操作失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const handleFavorite = () => {
  if (poem.value) {
    poemStore.favoritePoem(poem.value.id)
  }
}

const handleShare = () => {
  // 分享功能实现
  console.log('分享诗词')
}
</script>

<style scoped>
.poem-detail {
  min-height: 100vh;
  padding-top: 0;
}

.poem-header {
  text-align: center;
  margin-bottom: 40px;
}

.poem-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.author-info {
  font-size: 1.2rem;
  color: var(--text-secondary);
  font-style: italic;
}

.poem-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.poem-content h3 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  border-left: 3px solid var(--accent-color);
  padding-left: 1rem;
}

.original-text .text-content {
  font-size: 1.3rem;
  line-height: 2;
  text-align: center;
}

.poem-line {
  margin-bottom: 0.5rem;
}

.annotations ul {
  list-style: none;
  padding-left: 0;
}

.annotations li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.translation p,
.appreciation p {
  line-height: 1.8;
  font-size: 1.1rem;
}

.poem-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-liked {
  background-color: #ec4899;
  color: white;
  border: none;
}

.btn-liked:hover {
  background-color: #db2777;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .poem-header h1 {
    font-size: 2rem;
  }
  
  .poem-content {
    padding: 20px;
  }
  
  .poem-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>