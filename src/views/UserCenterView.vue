<template>
  <div class="user-center">
    <NavBar />
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
        
        <div class="logout-section">
          <button class="btn btn-logout" @click="handleLogout">
            <span class="logout-icon">🚪</span>
            退出登录
          </button>
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
          <!-- 点赞记录 -->
          <div v-if="activeTab === 'likes'" class="likes-list">
            <h3>我的点赞记录</h3>
            <div class="likes-stats">
              <div class="stat-item">
                <span class="stat-number">{{ userStats.likes }}</span>
                <span class="stat-label">当前点赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ userStats.unlikes }}</span>
                <span class="stat-label">取消点赞</span>
              </div>
            </div>
            <div class="likes-history">
              <div v-for="like in likes" :key="like.id" class="like-item">
                <div class="like-info">
                  <h4>{{ like.poem?.title || '未知诗词' }}</h4>
                  <p class="author">{{ like.poem?.author || '未知作者' }} · {{ like.poem?.dynasty || '未知朝代' }}</p>
                  <p class="excerpt">{{ like.poem?.content?.substring(0, 30) || '暂无内容' }}...</p>
                  <div class="poem-stats">
                    <span class="stat">👍 {{ like.poem?.likes || 0 }}</span>
                    <span class="stat">⭐ {{ like.poem?.favorites || 0 }}</span>
                  </div>
                </div>
                <div class="like-action">
                  <span :class="['action-badge', like.action === 'like' ? 'like' : 'unlike']">
                    {{ like.action === 'like' ? '👍 点赞' : '👎 取消点赞' }}
                  </span>
                  <span class="action-time">{{ formatDate(like.actionTime) }}</span>
                </div>
              </div>
            </div>
          </div>

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
                <p class="author">创作于 {{ formatDate(poem.created_at) }}</p>
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
import { useUserStore, usePoemStore } from '@/stores'
import type { User } from '@/types'
import type { Poem } from '@/lib/supabase'

const router = useRouter()
const userStore = useUserStore()
const poemStore = usePoemStore()

const activeTab = ref('collections')
const user = ref<User | null>(null)
const collections = ref<Poem[]>([])
const userLikes = ref<Poem[]>([])
const userCreations = ref<Poem[]>([])

const userStats = reactive({
  collections: 0,
  likes: 0,
  unlikes: 0,
  creations: 0
})

const likes = ref<any[]>([])

const userForm = reactive({
  username: '',
  email: '',
  bio: ''
})

const tabs = [
  { id: 'likes', label: '我的点赞' },
  { id: 'collections', label: '我的收藏' },
  { id: 'creations', label: '我的创作' },
  { id: 'profile', label: '个人信息' }
]

onMounted(async () => {
  // 获取当前登录用户
  user.value = userStore.user
  
  // 加载用户数据
  await loadUserData()

  // 初始化表单
  if (user.value) {
    userForm.username = user.value.username
    userForm.email = user.value.email
    userForm.bio = user.value.bio || ''
  }
})

const loadUserData = async () => {
  try {
    // 获取用户收藏数据
    await poemStore.fetchUserFavorites()
    collections.value = poemStore.favorites
    
    // 获取用户点赞记录
    const likesResult = await poemStore.fetchUserLikes()
    likes.value = likesResult.likes.map(like => ({
      id: like.id,
      poem: like.poems,
      action: 'like', // 当前点赞记录都是点赞操作
      actionTime: like.created_at
    }))
    
    // 更新统计数据
    userStats.collections = collections.value.length
    userStats.likes = likes.value.length
    userStats.unlikes = 0 // 暂时设为0，后续可以添加取消点赞记录
    userStats.creations = 0 // 暂时设为0，后续可以添加创作功能
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

const goToCreate = () => {
  router.push('/create')
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    alert('退出登录失败，请重试')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  padding-top: 0;
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

.poem-stats {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.likes-stats {
  display: flex;
  gap: 40px;
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.likes-stats .stat-item {
  text-align: center;
}

.likes-stats .stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.likes-stats .stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.likes-history {
  margin-top: 20px;
}

.like-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.like-item:hover {
  border-color: var(--primary-color);
}

.like-info {
  flex: 1;
}

.like-action {
  text-align: right;
  min-width: 120px;
}

.action-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.action-badge.like {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.action-badge.unlike {
  background-color: #ffebee;
  color: #c62828;
}

.action-time {
  display: block;
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
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

.logout-section {
  margin-top: 2rem;
  text-align: center;
}

.btn-logout {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

.btn-logout:hover {
  background-color: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(211, 47, 47, 0.4);
}

.btn-logout:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
}

.logout-icon {
  font-size: 1.2rem;
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
  
  .btn-logout {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>