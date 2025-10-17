<template>
  <nav class="navbar" role="navigation" aria-label="主导航">
    <div class="container">
      <!-- 品牌标识区域 -->
      <div class="nav-brand">
        <router-link 
          to="/" 
          class="brand-link"
          aria-label="返回首页"
        >
          <h1>诗词赏析</h1>
        </router-link>
      </div>
      
      <!-- 导航菜单区域 -->
      <div class="nav-menu">
        <!-- 主要导航链接 -->
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ active: currentRoute === '/' }"
        >
          首页
        </router-link>
        <router-link 
          to="/category" 
          class="nav-link"
          :class="{ active: currentRoute === '/category' }"
        >
          诗词分类
        </router-link>
        <router-link 
          to="/search" 
          class="nav-link"
          :class="{ active: currentRoute === '/search' }"
        >
          诗词搜索
        </router-link>
        
        <!-- 用户相关区域 -->
        <div v-if="isLoggedIn" class="user-menu">
          <router-link 
            to="/user" 
            class="nav-link"
            :class="{ active: currentRoute === '/user' }"
          >
            {{ userDisplayName }}
          </router-link>
          <button 
            class="btn btn-secondary" 
            @click="handleLogout"
            aria-label="退出登录"
          >
            退出
          </button>
        </div>
        
        <!-- 认证按钮区域 -->
        <div v-else class="auth-buttons">
          <router-link 
            to="/login" 
            class="btn btn-secondary"
            aria-label="用户登录"
          >
            登录
          </router-link>
          <router-link 
            to="/register" 
            class="btn btn-primary"
            aria-label="用户注册"
          >
            注册
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import type { User } from '@/stores'

const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const currentRoute = ref<string>('/')

// 计算属性
const isLoggedIn = computed<boolean>(() => userStore.isLoggedIn)
const user = computed<User | null>(() => userStore.user)
const userDisplayName = computed<string>(() => {
  return user.value?.username || '用户'
})

// 生命周期钩子
onMounted(() => {
  updateCurrentRoute()
  // 监听路由变化
  window.addEventListener('popstate', updateCurrentRoute)
})

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('popstate', updateCurrentRoute)
})

/**
 * 更新当前路由
 */
const updateCurrentRoute = (): void => {
  currentRoute.value = route.path
}

/**
 * 处理用户退出登录
 */
const handleLogout = (): void => {
  // 确认退出
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    console.log('用户已退出登录')
  }
}

/**
 * 监听路由变化
 */
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath
})
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20px;
}

.brand-link {
  text-decoration: none;
  color: var(--primary-color);
}

.brand-link h1 {
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .auth-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .auth-buttons .btn {
    width: 100%;
    text-align: center;
  }
}
</style>