<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <h1>404</h1>
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在。</p>
        <div class="actions">
          <router-link to="/" class="btn btn-primary">返回首页</router-link>
          <button class="btn btn-secondary" @click="goBack">返回上页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  padding: 80px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}

.error-content {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-content h1 {
  font-size: 6rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 300;
}

.error-content h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.error-content p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-content {
    padding: 40px 20px;
    margin: 0 15px;
  }
  
  .error-content h1 {
    font-size: 4rem;
  }
  
  .error-content h2 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .actions .btn {
    width: 100%;
    text-align: center;
  }
}
</style>