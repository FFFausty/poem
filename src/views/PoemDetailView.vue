<template>
  <div class="poem-detail">
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
        <button class="btn btn-primary" @click="handleLike">
          👍 点赞 ({{ poem?.likes || 0 }})
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePoemStore } from '@/stores'
import type { Poem } from '@/stores'

const route = useRoute()
const poemStore = usePoemStore()

const poem = ref<Poem | null>(null)

onMounted(async () => {
  const poemId = parseInt(route.params.id as string)
  // 模拟数据
  poem.value = {
    id: poemId,
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    tags: ['思乡', '月亮'],
    annotations: [
      '床前：床前的地面',
      '疑是：好像是',
      '举头：抬头',
      '思故乡：思念家乡'
    ],
    translation: '明亮的月光洒在床前的地面上，好像地上泛起了一层白霜。我抬起头来，看那天空中的明月，不由得低头沉思，想起远方的家乡。',
    appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。后两句通过动作神态的刻画，深化思乡之情。',
    likes: 1234,
    favorites: 567,
    createdAt: '2024-01-01'
  }
})

const handleLike = () => {
  if (poem.value) {
    poemStore.likePoem(poem.value.id)
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
  padding: 40px 0;
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