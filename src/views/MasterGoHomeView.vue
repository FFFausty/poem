<!-- 基于MasterGo设计的诗词网站首页 -->
<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-10">
          <div class="text-2xl font-serif font-bold text-gray-800">诗韵雅集</div>
          <div class="hidden md:flex space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-gray-900 transition">首页</router-link>
            <router-link to="/search" class="text-gray-700 hover:text-gray-900 transition">诗词分类</router-link>
            <router-link to="/create" class="text-gray-700 hover:text-gray-900 transition">诗人介绍</router-link>
            <router-link to="/user" class="text-gray-700 hover:text-gray-900 transition">收藏夹</router-link>
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
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">唐诗</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">宋词</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">元曲</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">现代诗</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">山水诗</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">边塞诗</button>
              <button class="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition border border-gray-200">田园诗</button>
            </div>
          </section>

          <!-- Hot Poems Ranking -->
          <section class="mb-12">
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">热门诗词排行榜</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition" v-for="(poem, index) in hotPoems" :key="poem.id">
                <div class="flex items-start">
                  <div class="text-4xl font-bold text-gray-300 mr-4">#{{ index + 1 }}</div>
                  <div>
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">{{ poem.title }}</h3>
                    <p class="text-gray-600 mb-2">{{ poem.author }}</p>
                    <p class="text-gray-700">{{ poem.excerpt }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Comments Section -->
          <section>
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">诗词赏析评论</h2>
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div class="flex items-start mb-6" v-for="comment in comments" :key="comment.id">
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
                  <p class="text-gray-700 mb-3">{{ comment.content }}</p>
                  <div class="flex space-x-4">
                    <button class="text-gray-500 hover:text-red-500 flex items-center">
                      <i class="fas fa-heart mr-1"></i>
                      <span>{{ comment.likes }}</span>
                    </button>
                    <button class="text-gray-500 hover:text-blue-500 flex items-center">
                      <i class="fas fa-reply mr-1"></i>
                      <span>回复</span>
                    </button>
                    <button class="text-gray-500 hover:text-green-500 flex items-center">
                      <i class="fas fa-share-alt mr-1"></i>
                      <span>分享</span>
                    </button>
                  </div>
                </div>
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

          <!-- My Collection -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-serif font-bold text-gray-800">我的收藏</h3>
              <router-link to="/user" class="text-blue-600 text-sm">查看全部</router-link>
            </div>
            <div class="space-y-4">
              <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer" v-for="item in collections" :key="item.id">
                <img 
                  :src="item.image" 
                  alt="诗词配图" 
                  class="w-12 h-12 rounded-lg mr-3 object-cover"
                >
                <div>
                  <h4 class="font-bold text-gray-800">{{ item.title }}</h4>
                  <p class="text-gray-600 text-sm">{{ item.author }}</p>
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
              <li><router-link to="/search" class="hover:text-white transition">诗词分类</router-link></li>
              <li><router-link to="/create" class="hover:text-white transition">诗人介绍</router-link></li>
              <li><router-link to="/user" class="hover:text-white transition">收藏夹</router-link></li>
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
import { ref } from 'vue'

// 热门诗词数据
const hotPoems = ref([
  {
    id: 1,
    title: '将进酒',
    author: '李白',
    excerpt: '君不见黄河之水天上来，奔流到海不复回...'
  },
  {
    id: 2,
    title: '水调歌头',
    author: '苏轼',
    excerpt: '明月几时有？把酒问青天。不知天上宫阙...'
  },
  {
    id: 3,
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    excerpt: '大江东去，浪淘尽，千古风流人物...'
  },
  {
    id: 4,
    title: '登高',
    author: '杜甫',
    excerpt: '风急天高猿啸哀，渚清沙白鸟飞回...'
  }
])

// 评论数据
const comments = ref([
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
  },
  {
    id: 3,
    author: '文墨青年',
    avatar: 'https://ai-public.mastergo.com/ai/img_res/3a46c44c2389f96fe5fb81f90a516ca0.jpg',
    date: '2023年 11月 17日',
    content: '这首诗的妙处在于通过具体的动作描写来表达抽象的情感。"疑是地上霜"这一错觉的描写，更加突出了夜晚的寂静和诗人的孤独。',
    likes: 15
  }
])

// 收藏数据
const collections = ref([
  {
    id: 1,
    title: '梅花',
    author: '王安石',
    image: 'https://ai-public.mastergo.com/ai/img_res/9dbe0bb6d0219e483bacd5befd426f58.jpg'
  },
  {
    id: 2,
    title: '爱莲说',
    author: '周敦颐',
    image: 'https://ai-public.mastergo.com/ai/img_res/da2917af9d4826201c10f3ad77111919.jpg'
  },
  {
    id: 3,
    title: '山行',
    author: '杜牧',
    image: 'https://ai-public.mastergo.com/ai/img_res/7715071621e0f08f81db8fb6d714dabd.jpg'
  }
])

const newComment = ref('')

const submitComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: comments.value.length + 1,
      author: '当前用户',
      avatar: 'https://ai-public.mastergo.com/ai/img_res/0ebece82af24e565971af2825f1f54a8.jpg',
      date: '刚刚',
      content: newComment.value,
      likes: 0
    })
    newComment.value = ''
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