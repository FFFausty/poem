<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Navigation Bar -->
    <nav class="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-10">
          <div class="text-2xl font-serif font-bold text-gray-800">诗韵雅集</div>
          <div class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-700 hover:text-gray-900 transition">首页</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 transition">诗词分类</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 transition">诗人介绍</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 transition">收藏夹</a>
            <a href="#" class="text-gray-700 hover:text-gray-900 transition">个人中心</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-gray-600 hover:text-gray-900">
            <i class="fas fa-search"></i>
          </button>
          <button class="text-gray-600 hover:text-gray-900">
            <i class="fas fa-user"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Swiper -->
    <section class="pt-20 pb-12 bg-gradient-to-r from-gray-100 to-gray-200">
      <div class="max-w-7xl mx-auto px-6">
        <Swiper
          :modules="swiperModules"
          :autoplay="{ delay: 5000 }"
          :pagination="{ clickable: true }"
          class="rounded-2xl overflow-hidden shadow-lg"
        >
          <SwiperSlide>
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
          </SwiperSlide>
          <SwiperSlide>
            <div class="relative h-96 flex items-center">
              <img 
                src="https://ai-public.mastergo.com/ai/img_res/34ebe403a920ce94d84c87a1df77c788.jpg" 
                alt="诗词背景" 
                class="absolute inset-0 w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="relative z-10 text-white px-12 max-w-2xl">
                <h2 class="text-4xl font-serif font-bold mb-4">春晓</h2>
                <p class="text-xl mb-2">孟浩然</p>
                <p class="text-lg leading-relaxed">春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="relative h-96 flex items-center">
              <img 
                src="https://ai-public.mastergo.com/ai/img_res/3901a550ad92dd523f84e53075733490.jpg" 
                alt="诗词背景" 
                class="absolute inset-0 w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="relative z-10 text-white px-12 max-w-2xl">
                <h2 class="text-4xl font-serif font-bold mb-4">竹里馆</h2>
                <p class="text-xl mb-2">王维</p>
                <p class="text-lg leading-relaxed">独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
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
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-start">
                  <div class="text-4xl font-bold text-gray-300 mr-4">#1</div>
                  <div>
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">将进酒</h3>
                    <p class="text-gray-600 mb-2">李白</p>
                    <p class="text-gray-700">君不见黄河之水天上来，奔流到海不复回...</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-start">
                  <div class="text-4xl font-bold text-gray-300 mr-4">#2</div>
                  <div>
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">水调歌头</h3>
                    <p class="text-gray-600 mb-2">苏轼</p>
                    <p class="text-gray-700">明月几时有？把酒问青天。不知天上宫阙...</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-start">
                  <div class="text-4xl font-bold text-gray-300 mr-4">#3</div>
                  <div>
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">念奴娇·赤壁怀古</h3>
                    <p class="text-gray-600 mb-2">苏轼</p>
                    <p class="text-gray-700">大江东去，浪淘尽，千古风流人物...</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div class="flex items-start">
                  <div class="text-4xl font-bold text-gray-300 mr-4">#4</div>
                  <div>
                    <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">登高</h3>
                    <p class="text-gray-600 mb-2">杜甫</p>
                    <p class="text-gray-700">风急天高猿啸哀，渚清沙白鸟飞回...</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Comments Section -->
          <section>
            <h2 class="text-2xl font-serif font-bold text-gray-800 mb-6">诗词赏析评论</h2>
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div class="flex items-start mb-6">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/8dffa57897e12c1023bcf70a26df9333.jpg" 
                  alt="用户头像" 
                  class="w-12 h-12 rounded-full mr-4 object-cover"
                >
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-gray-800">墨韵书香</h4>
                    <span class="text-gray-500 text-sm">2023年 11月 15日</span>
                  </div>
                  <p class="text-gray-700 mb-3">这首《静夜思》以明白如话的朴素语言，表达出深沉的思乡之情。"举头望明月，低头思故乡"这一仰一俯的动作，把游子的思乡之情表现得淋漓尽致。</p>
                  <div class="flex space-x-4">
                    <button class="text-gray-500 hover:text-red-500 flex items-center">
                      <i class="fas fa-heart mr-1"></i>
                      <span>24</span>
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
              
              <div class="flex items-start ml-16 mb-6">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/b1a6adaa941787143bde660b2a7cd0bb.jpg" 
                  alt="用户头像" 
                  class="w-10 h-10 rounded-full mr-4 object-cover"
                >
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-gray-800">诗韵清风</h4>
                    <span class="text-gray-500 text-sm">2023年 11月 16日</span>
                  </div>
                  <p class="text-gray-700">回复 @墨韵书香：深有同感！李白的这首诗虽然语言简单，但意境深远，千百年来引起无数游子的共鸣。</p>
                  <div class="flex space-x-4 mt-2">
                    <button class="text-gray-500 hover:text-red-500 flex items-center">
                      <i class="fas fa-heart mr-1"></i>
                      <span>8</span>
                    </button>
                    <button class="text-gray-500 hover:text-blue-500 flex items-center">
                      <i class="fas fa-reply mr-1"></i>
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/3a46c44c2389f96fe5fb81f90a516ca0.jpg" 
                  alt="用户头像" 
                  class="w-12 h-12 rounded-full mr-4 object-cover"
                >
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-gray-800">文墨青年</h4>
                    <span class="text-gray-500 text-sm">2023年 11月 17日</span>
                  </div>
                  <p class="text-gray-700">这首诗的妙处在于通过具体的动作描写来表达抽象的情感。"疑是地上霜"这一错觉的描写，更加突出了夜晚的寂静和诗人的孤独。</p>
                  <div class="flex space-x-4">
                    <button class="text-gray-500 hover:text-red-500 flex items-center">
                      <i class="fas fa-heart mr-1"></i>
                      <span>15</span>
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
                  class="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" 
                  rows="4" 
                  placeholder="请输入您的诗词赏析..."
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button class="!rounded-button whitespace-nowrap bg-gray-800 text-white px-6 py-2 hover:bg-gray-700 transition">
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
              <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <span class="flex items-center">
                  <i class="fas fa-bookmark text-gray-600 mr-3"></i>
                  <span>我的收藏</span>
                </span>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </button>
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
              <a href="#" class="text-blue-600 text-sm">查看全部</a>
            </div>
            <div class="space-y-4">
              <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/9dbe0bb6d0219e483bacd5befd426f58.jpg" 
                  alt="诗词配图" 
                  class="w-12 h-12 rounded-lg mr-3 object-cover"
                >
                <div>
                  <h4 class="font-bold text-gray-800">梅花</h4>
                  <p class="text-gray-600 text-sm">王安石</p>
                </div>
              </div>
              <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/da2917af9d4826201c10f3ad77111919.jpg" 
                  alt="诗词配图" 
                  class="w-12 h-12 rounded-lg mr-3 object-cover"
                >
                <div>
                  <h4 class="font-bold text-gray-800">爱莲说</h4>
                  <p class="text-gray-600 text-sm">周敦颐</p>
                </div>
              </div>
              <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                <img 
                  src="https://ai-public.mastergo.com/ai/img_res/7715071621e0f08f81db8fb6d714dabd.jpg" 
                  alt="诗词配图" 
                  class="w-12 h-12 rounded-lg mr-3 object-cover"
                >
                <div>
                  <h4 class="font-bold text-gray-800">山行</h4>
                  <p class="text-gray-600 text-sm">杜牧</p>
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
              <li><a href="#" class="hover:text-white transition">首页</a></li>
              <li><a href="#" class="hover:text-white transition">诗词分类</a></li>
              <li><a href="#" class="hover:text-white transition">诗人介绍</a></li>
              <li><a href="#" class="hover:text-white transition">收藏夹</a></li>
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
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';

// Swiper modules
const swiperModules = [Pagination, Autoplay];
</script>

<style scoped>
/* Custom styles if needed */
</style>

