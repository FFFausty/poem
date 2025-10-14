<template>
  <div class="register-view">
    <div class="container">
      <div class="register-form">
        <h1>用户注册</h1>
        
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <input 
              v-model="registerForm.username" 
              type="text" 
              required 
              placeholder="请输入用户名"
            />
          </div>
          
          <div class="form-group">
            <label>邮箱</label>
            <input 
              v-model="registerForm.email" 
              type="email" 
              required 
              placeholder="请输入邮箱"
            />
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              v-model="registerForm.password" 
              type="password" 
              required 
              placeholder="请输入密码"
            />
            <div class="password-strength" :class="strengthClass">
              密码强度: {{ strengthText }}
            </div>
          </div>
          
          <div class="form-group">
            <label>确认密码</label>
            <input 
              v-model="registerForm.confirmPassword" 
              type="password" 
              required 
              placeholder="请再次输入密码"
            />
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        
        <div class="register-links">
          <router-link to="/login">已有账号？立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { validatePasswordStrength } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  return validatePasswordStrength(registerForm.password)
})

const strengthText = computed(() => {
  const texts = ['弱', '中', '强']
  return texts[passwordStrength.value]
})

const strengthClass = computed(() => {
  const classes = ['weak', 'medium', 'strong']
  return classes[passwordStrength.value]
})

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.email || !registerForm.password) {
    alert('请填写完整信息')
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  if (passwordStrength.value === 0) {
    alert('密码强度太弱，请使用更复杂的密码')
    return
  }

  loading.value = true
  
  try {
    // 模拟注册
    setTimeout(() => {
      userStore.setUser({
        id: 1,
        username: registerForm.username,
        email: registerForm.email,
        createdAt: new Date().toISOString()
      })
      userStore.setToken('mock-token')
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('Register error:', error)
    alert('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  padding: 60px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.register-form {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-form h1 {
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

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.password-strength.weak {
  background-color: #ffe6e6;
  color: #d63031;
}

.password-strength.medium {
  background-color: #fff9e6;
  color: #f39c12;
}

.password-strength.strong {
  background-color: #e6f7e6;
  color: #27ae60;
}

.register-form button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 1rem;
}

.register-links {
  text-align: center;
}

.register-links a {
  color: var(--primary-color);
  text-decoration: none;
}

.register-links a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-form {
    padding: 30px 20px;
    margin: 0 15px;
  }
}
</style>