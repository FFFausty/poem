import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用路由
app.use(router)

// 初始化用户状态
import { useUserStore } from './stores/user'
const userStore = useUserStore()
userStore.initialize()

// 挂载应用
app.mount('#app')

console.log('🚀 诗词赏析网站已启动')
console.log('📚 基于Vue 3 + TypeScript + Supabase构建')
console.log('🔗 后端服务: Supabase')