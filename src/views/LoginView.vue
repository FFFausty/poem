<template>
  <div class="login-view">
    <NavBar />
    <div class="container">
      <div class="login-form">
        <h1>用户登录</h1>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>邮箱</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="请输入邮箱"
            />
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              required 
              placeholder="请输入密码"
            />
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <div class="login-links">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { supabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    alert('请填写完整信息')
    return
  }

  loading.value = true
  
  try {
    const success = await userStore.login({
      email: loginForm.email,
      password: loginForm.password
    })

    if (success) {
      router.push('/')
    } else {
      // 显示具体的错误信息
      const errorMessage = userStore.error || '登录失败，请检查网络连接或联系管理员'
      console.error('登录失败:', errorMessage)
      alert(errorMessage)
    }
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    alert(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  padding-top: 0;
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-form h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 2rem;
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.login-form button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 1rem;
}

.login-links {
  text-align: center;
}

.login-links a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-links a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-form {
    padding: 30px 20px;
    margin: 0 15px;
  }
}
</style>