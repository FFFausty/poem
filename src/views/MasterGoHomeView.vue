<!-- 基于MasterGo设计的诗词网站首页 -->
<template>
  <div class="min-h-screen bg-gray-50 font-sans" style="min-height: 100vh;">
    <!-- 诗词详情模态框 -->
    <div v-if="selectedPoem" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-3xl font-serif font-bold text-gray-800">《{{ selectedPoem.title }}》</h2>
            <button @click="selectedPoem = null" class="text-gray-400 hover:text-gray-600 text-2xl">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-6">
            <!-- 诗词基本信息 -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-xl font-semibold text-gray-800">{{ selectedPoem.author }}</p>
                  <p class="text-gray-600">{{ selectedPoem.dynasty }}</p>
                </div>
                <div class="flex items-center space-x-4 text-gray-600">
                  <span class="flex items-center">
                    <i class="fas fa-heart text-red-400 mr-1"></i>
                    {{ selectedPoem.likes }}
                  </span>
                  <span class="flex items-center">
                    <i class="fas fa-bookmark text-blue-400 mr-1"></i>
                    {{ selectedPoem.favorites }}
                  </span>
                </div>
              </div>
              
              <!-- 诗词内容 -->
              <div class="text-center">
                <div class="text-2xl leading-relaxed font-serif text-gray-800 mb-4">
                  {{ selectedPoem.content }}
                </div>
                <div v-if="selectedPoem.analysis" class="text-gray-600 text-sm">
                  {{ selectedPoem.analysis }}
                </div>
              </div>
            </div>
            
            <!-- 诗词标签 -->
            <div v-if="selectedPoem.tags && selectedPoem.tags.length" class="flex flex-wrap gap-2">
              <span v-for="tag in selectedPoem.tags" :key="tag" 
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {{ tag }}
              </span>
            </div>
            
            <!-- 诗词赏析 -->
            <div v-if="selectedPoem.analysis" class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">诗词赏析</h3>
              <p class="text-gray-700 leading-relaxed">{{ selectedPoem.analysis }}</p>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-4 pt-4">
              <button 
                @click="likePoem(selectedPoem.id)"
                :disabled="isLoading"
                :class="[
                  'flex-1 py-3 rounded-lg transition',
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                ]"
                class="text-white"
              >
                <i class="fas fa-heart mr-2"></i>
                {{ isLoading ? '处理中...' : '点赞' }}
              </button>
              <button 
                @click="favoritePoem(selectedPoem.id)"
                :disabled="isLoading"
                :class="[
                  'flex-1 py-3 rounded-lg transition',
                  isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                ]"
                class="text-white"
              >
                <i class="fas fa-bookmark mr-2"></i>
                {{ isLoading ? '处理中...' : '收藏' }}
              </button>
              <button class="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition">
                <i class="fas fa-share-alt mr-2"></i>分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-10">
          <div class="text-2xl font-serif font-bold text-gray-800">诗韵雅集</div>
          <div class="hidden md:flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-gray-900 transition">首页</router-link>
            <router-link to="/category" class="text-gray-700 hover:text-gray-900 transition">诗词分类</router-link>
            <router-link to="/authors" class="text-gray-700 hover:text-gray-900 transition">诗人介绍</router-link>
            <router-link to="/create" class="text-gray-700 hover:text-gray-900 transition">诗词添加</router-link>
            <router-link to="/user" class="text-gray-700 hover:text-gray-900 transition">个人中心</router-link>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/search" class="text-gray-600 hover:text-gray-900">
            <i class="fas fa-search"></i>
          </router-link>
          <router-link to="/user" class="text-gray-600 hover:text-gray-900">
            <i class="fas fa-user"></i>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Swiper -->
    <section class="pt-20 pb-12 bg-gradient-to-r from-gray-100 to-gray-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="swiper-container rounded-2xl overflow-hidden shadow-lg">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="relative h-96 flex items-center">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/2df2b7f0f79413b13e46fd51b6ea53c0.jpg" 
                  alt="诗词背景" 
                  class="absolute inset-0 w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-black bg-opacity-20"></div>
                <div class="relative z-10 text-white px-12 max-w-2xl">
                  <h2 class="text-4xl font-serif font-bold mb-4">静夜思</h2>
                  <p class="text-xl mb-2">李白</p>
                  <p class="text-lg leading-relaxed">床前明月光，疑是地上霜。举头望明月，低头思故乡。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Content -->
        <div class="lg:w-2/3">
          <!-- Category Tags -->
          <section class="mb-12">
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">诗词分类</h2>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="category in categories" 
                :key="category.id"
                class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
              >
                {{ category.name }} ({{ category.count }})
              </button>
            </div>
          </section>

          <!-- Hot Poems Ranking -->
          <section class="mb-12">
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">热门诗词排行榜</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer" 
                   v-for="(poem, index) in hotPoems" :key="poem.id"
                   @click="showPoemDetail(poem.id)">
                <div class="flex items-start">
                  <div class="text-4xl font-bold" :class="index < 3 ? 'text-yellow-500' : 'text-gray-300'">#{{ index + 1 }}</div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">{{ poem.title }}</h3>
                    <p class="text-gray-600 mb-2">{{ poem.author }}</p>
                    <p class="text-gray-700 mb-3">{{ poem.excerpt }}</p>
                    <div class="flex items-center text-sm text-gray-500">
                      <i class="fas fa-heart text-red-400 mr-1"></i>
                      <span class="mr-4">{{ poem.likes }} 赞</span>
                      <i class="fas fa-bookmark text-blue-400 mr-1"></i>
                      <span>{{ poem.favorites }} 收藏</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Comments Section -->
          <section>
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">诗词赏析评论</h2>
            
            <!-- 评论统计 -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-gray-800">全部评论 ({{ totalComments }})</h3>
                <div class="text-sm text-gray-500">
                  第 {{ currentPage }} 页，共 {{ Math.ceil(totalComments / commentsPerPage) }} 页
                </div>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div v-if="commentsLoading" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
                <p class="text-gray-600 mt-2">加载评论中...</p>
              </div>
              
              <div v-else-if="comments.length === 0" class="text-center py-8">
                <i class="fas fa-comments text-gray-300 text-4xl"></i>
                <p class="text-gray-600 mt-2">暂无评论，快来发表第一条评论吧！</p>
              </div>
              
              <div v-else>
                <div class="flex items-start mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0" 
                     v-for="comment in comments" :key="comment.id">
                  <img 
                    :src="comment.avatar" 
                    alt="用户头像" 
                    class="w-12 h-12 rounded-full mr-4 object-cover"
                  >
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-2">
                      <h4 class="font-bold text-gray-800">{{ comment.author }}</h4>
                      <span class="text-gray-500 text-sm">{{ comment.date }}</span>
                    </div>
                    <p class="text-gray-700 mb-3 leading-relaxed">{{ comment.content }}</p>
                    <div class="flex space-x-4">
                      <button 
                        @click="likeComment(comment.id)"
                        class="text-gray-500 hover:text-red-500 flex items-center transition"
                      >
                        <i class="fas fa-heart mr-1"></i>
                        <span>{{ comment.likes }}</span>
                      </button>
                      <button class="text-gray-500 hover:text-blue-500 flex items-center transition">
                        <i class="fas fa-reply mr-1"></i>
                        <span>回复</span>
                      </button>
                      <button class="text-gray-500 hover:text-green-500 flex items-center transition">
                        <i class="fas fa-share-alt mr-1"></i>
                        <span>分享</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 分页导航 -->
              <div v-if="totalComments > commentsPerPage" class="flex justify-center items-center mt-6 pt-6 border-t border-gray-100">
                <button 
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="px-4 py-2 bg-gray-100 text-gray-600 rounded-l-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left mr-2"></i>上一页
                </button>
                
                <div class="flex space-x-1 mx-4">
                  <button 
                    v-for="page in Math.ceil(totalComments / commentsPerPage)" 
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-1 rounded transition',
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= Math.ceil(totalComments / commentsPerPage)"
                  class="px-4 py-2 bg-gray-100 text-gray-600 rounded-r-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页<i class="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </div>
            
            <!-- Comment Input -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">发表您的赏析</h3>
              <div class="flex items-start mb-4">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/0ebece82af24e565971af2825f1f54a8.jpg" 
                  alt="用户头像" 
                  class="w-10 h-10 rounded-full mr-4 object-cover"
                >
                <textarea 
                  v-model="newComment"
                  class="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" 
                  rows="4" 
                  placeholder="请输入您的诗词赏析..."
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button 
                  @click="submitComment"
                  class="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  发表评论
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <div class="lg:w-1/3">
          <!-- Personal Panel -->
          <div class="bg-white rounded-xl shadow-sm p-6 mb-8 sticky top-24">
            <h3 class="text-xl font-serif font-bold text-gray-800 mb-4">个人操作</h3>
            <div class="space-y-4">
              <router-link to="/user" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <span class="flex items-center">
                  <i class="fas fa-bookmark text-gray-600 mr-3"></i>
                  <span>我的收藏</span>
                </span>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </router-link>
              <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <span class="flex items-center">
                  <i class="fas fa-share-alt text-gray-600 mr-3"></i>
                  <span>分享诗词</span>
                </span>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>
              <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <span class="flex items-center">
                  <i class="fas fa-moon text-gray-600 mr-3"></i>
                  <span>夜间模式</span>
                </span>
                <div class="relative inline-block w-12 h-6 bg-gray-300 rounded-full">
                  <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                </div>
              </button>
            </div>
          </div>

          <!-- Recent Poems -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-serif font-bold text-gray-800">最新诗词</h3>
              <router-link to="/search" class="text-blue-600 text-sm">查看全部</router-link>
            </div>
            <div class="space-y-4">
              <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer" 
                   v-for="poem in allPoems.slice(0, 3)" :key="poem.id"
                   @click="showPoemDetail(poem.id)">
                <div class="w-12 h-12 rounded-lg mr-3 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <i class="fas fa-book text-blue-500"></i>
                </div>
                <div>
                  <h4 class="font-bold text-gray-800">{{ poem.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ poem.author }} · {{ poem.dynasty }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-serif font-bold mb-4">诗韵雅集</h3>
            <p class="text-gray-400">传承中华文化，品味诗词之美。在这里，与千古文人墨客对话，感受文字的力量。</p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">快速链接</h4>
            <ul class="space-y-2 text-gray-400">
              <li><router-link to="/" class="hover:text-white transition">首页</router-link></li>
              <li><router-link to="/category" class="hover:text-white transition">诗词分类</router-link></li>
              <li><router-link to="/authors" class="hover:text-white transition">诗人介绍</router-link></li>
              <li><router-link to="/create" class="hover:text-white transition">诗词添加</router-link></li>
              <li><router-link to="/user" class="hover:text-white transition">个人中心</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">联系我们</h4>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center">
                <i class="fas fa-envelope mr-2"></i>
                <span>contact@shiyunyaji.com</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-phone mr-2"></i>
                <span>400-123-4567</span>
              </li>
              <li class="flex items-center">
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span>北京市朝阳区文化路 123 号</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">关注我们</h4>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition">
                <i class="fab fa-weibo"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition">
                <i class="fab fa-weixin"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
            <p class="text-gray-400">扫码关注公众号</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2023 诗韵雅集. 保留所有权利。京 ICP 备 12345678 号</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import poemsData from '@/data/poems.json'
import { supabaseInteractionApi, supabaseUserApi } from '@/api/supabase'
import { supabase } from '@/lib/supabase'

// 诗词详情模态框
const selectedPoem = ref<any>(null)

// 热门诗词数据 - 使用真实数据
const hotPoems = ref<any[]>([])
const allPoems = ref<any[]>([])
const categories = ref<any[]>([])
const tags = ref<string[]>([])

// 当前用户
const currentUser = ref<any>(null)
const isLoading = ref(false)

// 评论相关变量
const comments = ref<any[]>([])
const newComment = ref('')
const currentPage = ref(1)
const commentsPerPage = 10
const totalComments = ref(0)
const commentsLoading = ref(false)

onMounted(async () => {
  // 初始化诗词数据
  allPoems.value = poemsData.poems
  categories.value = poemsData.categories
  tags.value = poemsData.tags
  
  // 按点赞数排序获取热门诗词
  hotPoems.value = [...poemsData.poems]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 4)
    .map(poem => ({
      id: poem.id,
      title: poem.title,
      author: poem.author,
      excerpt: poem.content.substring(0, 20) + '...',
      likes: poem.likes,
      favorites: poem.favorites
    }))

  // 检查用户登录状态
  await checkUserAuth()
  
  // 加载评论数据
  await loadCommentsFromDatabase()
})

// 检查用户认证状态
const checkUserAuth = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      try {
        currentUser.value = await supabaseUserApi.getCurrentUser()
      } catch (error) {
        console.log('获取用户信息失败，用户可能未完成注册:', error)
      }
    }
  } catch (error) {
    console.error('检查用户认证状态失败:', error)
  }
}

// 点赞诗词
const likePoem = async (poemId: number) => {
  if (isLoading.value) return
  
  // 检查用户是否登录
  if (!currentUser.value) {
    alert('请先登录后再点赞')
    return
  }

  isLoading.value = true
  
  try {
    // 尝试使用Supabase API
    const result = await supabaseInteractionApi.likePoem(poemId, currentUser.value.id)
    
    // 更新诗词详情模态框中的点赞数
    if (selectedPoem.value && selectedPoem.value.id === poemId) {
      selectedPoem.value.likes = result.likes
    }
    
    // 更新热门诗词列表中的点赞数
    const hotPoemIndex = hotPoems.value.findIndex((p: any) => p.id === poemId)
    if (hotPoemIndex !== -1) {
      hotPoems.value[hotPoemIndex].likes = result.likes
    }
    
    // 更新所有诗词列表中的点赞数
    const allPoemIndex = allPoems.value.findIndex((p: any) => p.id === poemId)
    if (allPoemIndex !== -1) {
      allPoems.value[allPoemIndex].likes = result.likes
    }
    
    console.log(`点赞成功，当前点赞数: ${result.likes}`)
  } catch (error: any) {
    console.error('Supabase点赞失败，使用本地存储:', error)
    
    // 使用本地存储作为备用方案
    try {
      // 获取本地存储的点赞数据
      const localLikes = JSON.parse(localStorage.getItem('poem_likes') || '{}')
      const currentLikes = localLikes[poemId] || 0
      
      // 模拟点赞操作（增加1）
      const newLikes = currentLikes + 1
      localLikes[poemId] = newLikes
      localStorage.setItem('poem_likes', JSON.stringify(localLikes))
      
      // 更新界面
      if (selectedPoem.value && selectedPoem.value.id === poemId) {
        selectedPoem.value.likes = newLikes
      }
      
      const hotPoemIndex = hotPoems.value.findIndex((p: any) => p.id === poemId)
      if (hotPoemIndex !== -1) {
        hotPoems.value[hotPoemIndex].likes = newLikes
      }
      
      const allPoemIndex = allPoems.value.findIndex((p: any) => p.id === poemId)
      if (allPoemIndex !== -1) {
        allPoems.value[allPoemIndex].likes = newLikes
      }
      
      console.log(`本地点赞成功，当前点赞数: ${newLikes}`)
    } catch (localError) {
      console.error('本地点赞也失败:', localError)
      alert('点赞功能暂时不可用，请稍后重试')
    }
  } finally {
    isLoading.value = false
  }
}

// 收藏诗词
const favoritePoem = async (poemId: number) => {
  if (isLoading.value) return
  
  // 检查用户是否登录
  if (!currentUser.value) {
    alert('请先登录后再收藏')
    return
  }

  isLoading.value = true
  
  try {
    // 尝试使用Supabase API
    const result = await supabaseInteractionApi.favoritePoem(poemId, currentUser.value.id)
    
    // 更新诗词详情模态框中的收藏数
    if (selectedPoem.value && selectedPoem.value.id === poemId) {
      selectedPoem.value.favorites = result.favorites
    }
    
    // 更新热门诗词列表中的收藏数
    const hotPoemIndex = hotPoems.value.findIndex((p: any) => p.id === poemId)
    if (hotPoemIndex !== -1) {
      hotPoems.value[hotPoemIndex].favorites = result.favorites
    }
    
    // 更新所有诗词列表中的收藏数
    const allPoemIndex = allPoems.value.findIndex((p: any) => p.id === poemId)
    if (allPoemIndex !== -1) {
      allPoems.value[allPoemIndex].favorites = result.favorites
    }
    
    console.log(`收藏成功，当前收藏数: ${result.favorites}`)
  } catch (error: any) {
    console.error('Supabase收藏失败，使用本地存储:', error)
    
    // 使用本地存储作为备用方案
    try {
      // 获取本地存储的收藏数据
      const localFavorites = JSON.parse(localStorage.getItem('poem_favorites') || '{}')
      const currentFavorites = localFavorites[poemId] || 0
      
      // 模拟收藏操作（增加1）
      const newFavorites = currentFavorites + 1
      localFavorites[poemId] = newFavorites
      localStorage.setItem('poem_favorites', JSON.stringify(localFavorites))
      
      // 更新界面
      if (selectedPoem.value && selectedPoem.value.id === poemId) {
        selectedPoem.value.favorites = newFavorites
      }
      
      const hotPoemIndex = hotPoems.value.findIndex((p: any) => p.id === poemId)
      if (hotPoemIndex !== -1) {
        hotPoems.value[hotPoemIndex].favorites = newFavorites
      }
      
      const allPoemIndex = allPoems.value.findIndex((p: any) => p.id === poemId)
      if (allPoemIndex !== -1) {
        allPoems.value[allPoemIndex].favorites = newFavorites
      }
      
      console.log(`本地收藏成功，当前收藏数: ${newFavorites}`)
    } catch (localError) {
      console.error('本地收藏也失败:', localError)
      alert('收藏功能暂时不可用，请稍后重试')
    }
  } finally {
    isLoading.value = false
  }
}



// 显示诗词详情
const showPoemDetail = (poemId: number) => {
  const poem = allPoems.value.find(p => p.id === poemId)
  if (poem) {
    selectedPoem.value = poem
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('请输入评论内容')
    return
  }

  // 检查用户是否登录
  if (!currentUser.value) {
    alert('请先登录后再发表评论')
    return
  }

  // 添加超时控制
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('评论操作超时，请检查网络连接')), 10000)
  })

  try {
    // 如果有选中的诗词，则关联评论到该诗词
    const poemId = selectedPoem.value?.id || 1 // 默认使用第一首诗词
    
    // 调用Supabase API添加评论（带超时控制）
    const commentData = await Promise.race([
      supabaseInteractionApi.addComment(
        poemId, 
        currentUser.value.id, 
        newComment.value.trim()
      ),
      timeoutPromise
    ])
    
    newComment.value = ''
    alert('评论发表成功！')
    
    // 重新加载评论数据，确保显示最新评论
    await loadCommentsFromDatabase()
    
  } catch (error: any) {
    console.error('发表评论失败:', error)
    
    // 如果Supabase调用失败，使用本地存储作为备用方案
    try {
      console.log('Supabase评论失败，使用本地存储作为备用方案')
      comments.value.unshift({
        id: comments.value.length + 1,
        author: currentUser.value.username || '当前用户',
        avatar: 'https://ai-public.mastergo.com/ai/img_res/0ebece82af24e565971af2825f1f54a8.jpg',
        date: '刚刚',
        content: newComment.value.trim(),
        likes: 0
      })
      newComment.value = ''
      alert('评论发表成功（本地存储）！')
    } catch (localError) {
      console.error('本地评论也失败:', localError)
      alert('评论功能暂时不可用，请稍后重试')
    }
  }
}

// 从数据库加载评论
const loadCommentsFromDatabase = async () => {
  commentsLoading.value = true
  try {
    // 获取评论总数
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
    
    totalComments.value = count || 0
    
    // 计算分页参数
    const startIndex = (currentPage.value - 1) * commentsPerPage
    const endIndex = startIndex + commentsPerPage - 1
    
    // 从数据库加载评论，按时间倒序排列
    const { data: commentData, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex)
    
    if (error) throw error
    
    // 转换评论数据格式
    comments.value = commentData.map(comment => ({
      id: comment.id,
      author: comment.profiles?.username || '匿名用户',
      avatar: comment.profiles?.avatar_url || 'https://ai-public.mastergo.com/ai/img_res/0ebece82af24e565971af2825f1f54a8.jpg',
      date: formatDate(comment.created_at),
      content: comment.content,
      likes: comment.likes || 0
    }))
    
  } catch (error) {
    console.error('加载评论失败:', error)
    // 如果数据库加载失败，使用默认评论数据
    comments.value = [
      {
        id: 1,
        author: '墨韵书香',
        avatar: 'https://ai-public.mastergo.com/ai/img_res/8dffa57897e12c1023bcf70a26df9333.jpg',
        date: '2023年 11月 15日',
        content: '这首《静夜思》以明白如话的朴素语言，表达出深沉的思乡之情。"举头望明月，低头思故乡"这一仰一俯的动作，把游子的思乡之情表现得淋漓尽致。',
        likes: 24
      },
      {
        id: 2,
        author: '诗韵清风',
        avatar: 'https://ai-public.mastergo.com/ai/img_res/b1a6adaa941787143bde660b2a7cd0bb.jpg',
        date: '2023年 11月 16日',
        content: '深有同感！李白的这首诗虽然语言简单，但意境深远，千百年来引起无数游子的共鸣。',
        likes: 8
      }
    ]
  } finally {
    commentsLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 翻页功能
const goToPage = (page: number) => {
  if (page < 1 || page > Math.ceil(totalComments.value / commentsPerPage)) return
  currentPage.value = page
  loadCommentsFromDatabase()
}

// 点赞评论（示例功能，需要后端支持）
const likeComment = (commentId: number) => {
  if (!currentUser.value) {
    alert('请先登录后再点赞评论')
    return
  }
  
  // 这里可以添加评论点赞的API调用
  const comment = comments.value.find((c: any) => c.id === commentId)
  if (comment) {
    comment.likes += 1
    console.log(`点赞评论 ${commentId} 成功`)
  }
}
</script>

<style scoped>
/* 自定义样式 */
.swiper-container {
  height: 384px; /* h-96 */
}

.swiper-slide {
  height: 100%;
}
</style>