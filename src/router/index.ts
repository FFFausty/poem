import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/MasterGoHomeView.vue'),
    meta: { title: '诗韵雅集 - 诗词赏析平台' }
  },
  {
    path: '/classic',
    name: 'ClassicHome',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '经典版首页' }
  },
  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: () => import('@/views/PoemDetailView.vue'),
    meta: { title: '诗词详情' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: '诗词搜索' }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/UserCenterView.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/create',
    name: 'CreatePoem',
    component: () => import('@/views/CreatePoemView.vue'),
    meta: { title: '诗词创作', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '用户登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: '用户注册' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  next()
})

export default router