# AI助手集成指南

## 功能概述
为诗韵雅集网站集成了悬浮AI助手，提供诗词赏析、技术支持和用户指导服务。

## 文件结构
```
poem/
├── src/components/FloatingAssistant.vue    # 悬浮助手组件
├── n8n-workflow.json                       # n8n工作流配置
├── n8n-deployment.md                       # 部署指南
├── start-assistant.bat                      # Windows启动脚本
├── start-assistant.sh                       # Linux/Mac启动脚本
└── .env.example                            # 环境变量示例
```

## 快速开始

### 1. 环境准备
```bash
# 安装n8n（Docker方式）
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n

# 或使用npm安装
npm install -g n8n
```

### 2. 导入工作流
1. 访问 http://localhost:5678
2. 导入 `n8n-workflow.json`
3. 激活工作流

### 3. 启动应用
```bash
# Windows
start-assistant.bat

# Linux/Mac
chmod +x start-assistant.sh
./start-assistant.sh
```

## 功能特性

### 悬浮助手功能
- 🤖 **智能对话**：基于n8n工作流的AI对话
- 📱 **响应式设计**：适配移动端和桌面端
- ⚡ **实时交互**：即时消息发送和接收
- 🎨 **美观界面**：现代化UI设计

### 支持的问题类型
1. **诗词相关**
   - 诗词赏析和解读
   - 作者背景介绍
   - 文化背景解释

2. **技术问题**
   - Vue 3 + TypeScript开发
   - Supabase数据库操作
   - 项目部署指导

3. **使用帮助**
   - 网站功能说明
   - 操作指导
   - 故障排除

## 配置说明

### 环境变量
在 `.env` 文件中配置：
```env
VITE_AI_ASSISTANT_ENABLED=true
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ai-assistant
```

### 自定义提示词
修改 `n8n-workflow.json` 中的代码节点，调整AI助手的回答风格和内容。

## 开发指南

### 添加新的问题类型
在n8n工作流中修改消息处理逻辑：
```javascript
// 添加新的意图识别
if (message.includes('你的关键词')) {
    response = '你的自定义回复';
}
```

### 样式定制
修改 `FloatingAssistant.vue` 中的CSS变量：
```css
:root {
  --assistant-primary: #667eea;
  --assistant-secondary: #764ba2;
}
```

## 部署说明

### 开发环境
- 前端：端口3000
- n8n：端口5678
- 使用本地n8n实例

### 生产环境
1. 部署n8n到云服务
2. 更新Webhook URL
3. 配置SSL证书
4. 设置访问权限

## 故障排除

### 常见问题
1. **助手不显示**
   - 检查环境变量 `VITE_AI_ASSISTANT_ENABLED`
   - 确认组件已导入App.vue

2. **消息发送失败**
   - 检查n8n服务是否运行
   - 验证Webhook URL配置
   - 查看浏览器控制台错误

3. **样式异常**
   - 检查CSS加载顺序
   - 确认TailwindCSS配置

### 日志查看
```bash
# n8n日志
docker logs n8n

# 前端日志
浏览器开发者工具 -> Console
```

## 扩展建议

### 功能扩展
1. **语音输入**：集成Web Speech API
2. **文件上传**：支持图片/文档分析
3. **多语言**：添加国际化支持
4. **知识库**：集成外部API增强回答能力

### 性能优化
1. **消息缓存**：减少重复请求
2. **连接池**：优化Webhook连接
3. **懒加载**：按需加载助手组件

## 技术支持
如有问题，请查看：
- [n8n官方文档](https://docs.n8n.io/)
- [Vue 3文档](https://v3.vuejs.org/)
- [项目GitHub仓库](https://github.com/FFFausty/poem)

---

**诗韵小助手** - 让诗词欣赏更智能、更便捷！