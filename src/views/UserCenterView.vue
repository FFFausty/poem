<template>
  <div class="user-center">
    <div class="container">
      <div class="user-profile">
        <div class="avatar-section">
          <img :src="user?.avatar || '/default-avatar.png'" alt="头像" class="avatar" />
          <h2>{{ user?.username }}</h2>
          <p class="bio">{{ user?.bio || '暂无简介' }}</p>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ userStats.collections }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userStats.likes }}</span>
            <span class="stat-label">点赞</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userStats.creations }}</span>
            <span class="stat-label">创作</span>
          </div>
        </div>
      </div>

      <div class="user-content">
        <div class="tab-navigation">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- 收藏的诗词 -->
          <div v-if="activeTab === 'collections'" class="collections-list">
            <h3>我的收藏</h3>
            <div class="poems-grid">
              <div v-for="poem in collections" :key="poem.id" class="poem-item">
                <h4>{{ poem.title }}</h4>
                <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
                <p class="excerpt">{{ poem.content.substring(0, 30) }}...</p>
              </div>
            </div>
          </div>

          <!-- 我的创作 -->
          <div v-if="activeTab === 'creations'" class="creations-list">
            <h3>我的创作</h3>
            <div class="create-btn-section">
              <button class="btn btn-primary" @click="goToCreate">开始创作</button>
            </div>
            <div class="poems-grid">
              <div v-for="poem in userCreations" :key="poem.id" class="poem-item">
                <h4>{{ poem.title }}</h4>
                <p class="author">创作于 {{ formatDate(poem.createdAt) }}</p>
                <p class="excerpt">{{ poem.content.substring(0, 30) }}...</p>
                <div class="creation-actions">
                  <button class="btn btn-small">编辑</button>
                  <button class="btn btn-small btn-danger">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人信息 -->
          <div v-if="activeTab === 'profile'" class="profile-section">
            <h3>个人信息</h3>
            <form class="profile-form">
              <div class="form-group">
                <label>用户名</label>
                <input type="text" v-model="userForm.username" />
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input type="email" v-model="userForm.email" />
              </div>
              <div class="form-group">
                <label>个人简介</label>
                <textarea v-model="userForm.bio" rows="4"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">保存修改</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import type { User, Poem } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('collections')
const user = ref<User | null>(null)
const collections = ref<Poem[]>([])
const userCreations = ref<Poem[]>([])

const userStats = reactive({
  collections: 0,
  likes: 0,
  creations: 0
})

const userForm = reactive({
  username: '',
  email: '',
  bio: ''
})

const tabs = [
  { id: 'collections', label: '我的收藏' },
  { id: 'creations', label: '我的创作' },
  { id: 'profile', label: '个人信息' }
]

onMounted(() => {
  // 模拟用户数据
  user.value = {
    id: 1,
    username: '诗词爱好者',
    email: 'user@example.com',
    bio: '热爱传统文化，喜欢诗词创作',
    createdAt: '2024-01-01'
  }

  // 模拟收藏数据
  collections.value = [
    {
      id: 1,
      title: '静夜思',
      author: '李白',
      dynasty: '唐',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      tags: ['思乡'],
      likes: 1234,
      favorites: 567,
      createdAt: '2024-01-01'
    }
  ]

  userStats.collections = collections.value.length
  userStats.likes = 42
  userStats.creations = 3

  // 初始化表单
  if (user.value) {
    userForm.username = user.value.username
    userForm.email = user.value.email
    userForm.bio = user.value.bio || ''
  }
})

const goToCreate = () => {
  router.push('/create')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.user-center {
  padding: 40px 0;
}

.user-profile {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.user-profile h2 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.bio {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.user-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  padding: 30px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.poem-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.poem-item:hover {
  border-color: var(--primary-color);
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

.creation-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-small {
  padding: 4px 8px;
  font-size: 0.8rem;
}

.btn-danger {
  background-color: var(--error-color);
  color: white;
}

.create-btn-section {
  text-align: center;
  margin: 20px 0;
}

.profile-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .user-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .tab-navigation {
    flex-direction: column;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
  }
}
</style>