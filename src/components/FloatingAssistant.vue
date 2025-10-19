<template>
  <div class="floating-assistant" :class="{ active: isActive }">
    <!-- 悬浮按钮 -->
    <button @click="toggleAssistant" class="assistant-toggle" :class="{ pulse: hasNewMessage }">
      <span class="assistant-icon">🤖</span>
      <span class="assistant-badge" v-if="hasNewMessage">!</span>
    </button>

    <!-- 助手面板 -->
    <div v-if="isActive" class="assistant-panel">
      <div class="panel-header">
        <div class="header-info">
          <h3>诗卷灵</h3>
          <span class="status">在线</span>
        </div>
        <button @click="closeAssistant" class="close-btn">×</button>
      </div>

      <!-- 消息区域 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
          <div class="message-avatar">
            <span v-if="msg.type === 'assistant'">🤖</span>
            <span v-else>👤</span>
          </div>
          <div class="message-content">
            <div class="message-text">{{ msg.content }}</div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="quick-actions" v-if="showQuickActions">
          <button @click="quickAction('诗词搜索')" class="quick-btn">诗词搜索</button>
          <button @click="quickAction('诗词赏析')" class="quick-btn">诗词赏析</button>
          <button @click="quickAction('作者介绍')" class="quick-btn">作者介绍</button>
          <button @click="quickAction('文化背景')" class="quick-btn">文化背景</button>
        </div>
        <div class="input-wrapper">
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage" 
            placeholder="输入您的问题..." 
            ref="inputField"
            class="message-input"
          />
          <button @click="sendMessage" :disabled="!userInput.trim()" class="send-btn">
            <span>发送</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import axios from 'axios'

// 响应式数据
const isActive = ref(false)
const userInput = ref('')
const messages = ref<Array<{
  id: number
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}>>([])
const hasNewMessage = ref(false)
const showQuickActions = ref(true)
const messagesContainer = ref<HTMLElement>()
const inputField = ref<HTMLInputElement>()

// 初始化欢迎消息
onMounted(() => {
  addMessage('assistant', '您好！我是诗卷灵，专注于诗词赏析和文化解读，很高兴为您服务。')
})

// 切换助手面板
const toggleAssistant = () => {
  isActive.value = !isActive.value
  if (isActive.value) {
    nextTick(() => {
      inputField.value?.focus()
      scrollToBottom()
    })
    hasNewMessage.value = false
  }
}

// 关闭助手
const closeAssistant = () => {
  isActive.value = false
}

// 添加消息
const addMessage = (type: 'user' | 'assistant', content: string) => {
  const message = {
    id: Date.now(),
    type,
    content,
    timestamp: new Date()
  }
  messages.value.push(message)
  scrollToBottom()
  
  if (type === 'assistant' && !isActive.value) {
    hasNewMessage.value = true
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 发送消息
const sendMessage = async () => {
  const content = userInput.value.trim()
  if (!content) return

  // 添加用户消息
  addMessage('user', content)
  userInput.value = ''
  showQuickActions.value = false

  // 生产环境直接使用本地AI回复，避免API调用错误
  if (import.meta.env.PROD) {
    // 生产环境：直接使用本地AI回复
    const localResponse = generateLocalAIResponse(content)
    addMessage('assistant', localResponse)
  } else {
    // 开发环境：尝试调用n8n webhook
    try {
      const response = await axios.post('/api/webhook/59c166b5-9176-4d42-9d12-abadb682b80b/chat', {
        message: content,
        context: {
          userRole: '诗词爱好者',
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      })

      // 添加助手回复
      addMessage('assistant', response.data.output || '我暂时无法回答这个问题。')
    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 降级处理：提供本地AI回复
      const localResponse = generateLocalAIResponse(content)
      addMessage('assistant', localResponse)
    }
  }
}

// 快速操作
const quickAction = (action: string) => {
  let message = ''
  switch (action) {
    case '诗词搜索':
      message = '如何搜索特定的诗词？'
      break
    case '诗词赏析':
      message = '请帮我赏析一首诗词'
      break
    case '作者介绍':
      message = '介绍一位著名诗人'
      break
    case '文化背景':
      message = '讲解诗词的文化背景'
      break
    default:
      message = action
  }
  userInput.value = message
  sendMessage()
}

// 本地AI回复生成函数
const generateLocalAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  // 诗词相关查询
  if (lowerMessage.includes('诗') || lowerMessage.includes('词') || lowerMessage.includes('李白') || 
      lowerMessage.includes('杜甫') || lowerMessage.includes('苏轼') || lowerMessage.includes('唐诗') || 
      lowerMessage.includes('宋词')) {
    return `关于"${message}"，这是中华文化的瑰宝。在我们的网站上，您可以通过以下方式了解更多：

` +
           `📖 **搜索功能**：使用顶部搜索框查找特定诗词
` +
           `📚 **分类浏览**：在分类页面按朝代、作者浏览
` +
           `⭐ **热门推荐**：首页展示经典诗词和热门作品

` +
           `需要我为您详细介绍某首诗词吗？`
  }
  
  // 诗词创作指导
  if (lowerMessage.includes('创作') || lowerMessage.includes('写诗') || lowerMessage.includes('作词') || 
      lowerMessage.includes('格律')) {
    return `诗词创作需要掌握：

` +
           `📝 **格律规范**：平仄、押韵、对仗
` +
           `🎨 **意境营造**：情景交融、虚实结合
` +
           `📚 **典故运用**：恰当引用历史典故
` +
           `💭 **情感表达**：真情实感、含蓄隽永

` +
           `建议从模仿经典作品开始，逐步形成自己的风格。`
  }
  
  // 使用帮助
  if (lowerMessage.includes('怎么') || lowerMessage.includes('如何') || lowerMessage.includes('操作') || 
      lowerMessage.includes('功能')) {
    return `网站主要功能：

` +
           `🔍 **智能搜索**：支持诗词标题、作者、内容搜索
` +
           `📂 **分类浏览**：按朝代、风格、主题分类
` +
           `❤️ **收藏功能**：登录后收藏喜欢的诗词
` +
           `👤 **个人中心**：管理收藏和阅读历史
` +
           `📖 **诗词详情**：完整的诗词赏析和注释

` +
           `需要了解哪个具体功能？`
  }
  
  // 问候和默认回复
  if (lowerMessage.includes('你好') || lowerMessage.includes('您好') || lowerMessage.includes('hi') || 
      lowerMessage.includes('hello')) {
    return `您好！我是诗卷灵 📖

` +
           `我可以帮您：
` +
           `• 诗词赏析和深度解读
` +
           `• 文化背景和历史典故
` +
           `• 诗词创作指导
` +
           `• 文学知识问答

` +
           `请告诉我您需要什么帮助？`
  }
  
  // 默认回复
  return `您好！我是诗卷灵。

` +
         `我可以为您提供：
` +
         `📚 诗词赏析和文化解读
` +
         `🎨 意境营造和艺术欣赏
` +
         `📝 诗词创作指导
` +
         `📖 文学知识问答

` +
         `请具体描述您的问题，我会尽力帮助您！`
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 监听消息变化
watch(messages, () => {
  scrollToBottom()
})
</script>

<style scoped>
.floating-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.assistant-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.assistant-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.assistant-toggle.pulse {
  animation: pulse 2s infinite;
}

.assistant-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 350px;
  height: 450px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  font-size: 12px;
  opacity: 0.8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.messages-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #667eea;
  color: white;
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 10px 15px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.4;
}

.message.user .message-text {
  background: #667eea;
  color: white;
}

.message-time {
  font-size: 11px;
  color: #6c757d;
  margin-top: 5px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

.input-area {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e9ecef;
  border-radius: 25px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: #5a6fd8;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .assistant-panel {
    width: 300px;
    right: -10px;
  }
}
</style>