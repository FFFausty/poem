# n8n工作流部署指南

## 1. 启动n8n服务

```bash
# 使用Docker启动n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# 或者使用npm安装
npm install -g n8n
n8n start
```

## 2. 导入工作流

1. 访问 http://localhost:5678
2. 点击右上角"Workflows"
3. 点击"Import from file"
4. 选择 `n8n-workflow.json` 文件
5. 点击"Import"

## 3. 激活工作流

1. 在工作流列表中找到"诗词网站AI助手工作流"
2. 点击开关按钮激活工作流
3. 复制Webhook URL：`http://localhost:5678/webhook/ai-assistant`

## 4. 测试工作流

使用以下命令测试工作流：

```bash
# 测试诗词查询
curl -X POST http://localhost:5678/webhook/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"message": "李白诗词"}'

# 测试技术问题
curl -X POST http://localhost:5678/webhook/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"message": "Vue 3怎么用"}'
```

## 5. 环境配置

### 开发环境
```bash
# 前端应用端口：3000
# n8n端口：5678
# API端口：3001（如需要）
```

### 生产环境配置
在 `.env` 文件中添加：
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ai-assistant
VITE_AI_ASSISTANT_ENABLED=true
```

## 6. 前端集成

悬浮助手组件会自动检测环境：
- 开发环境：使用 `http://localhost:5678`
- 生产环境：使用配置的URL

## 7. 监控和日志

查看n8n日志：
```bash
# Docker方式
docker logs n8n

# 直接运行方式
n8n logs
```

## 8. 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -ano | findstr :5678
   # 修改n8n端口
   docker run -p 5679:5678 n8nio/n8n
   ```

2. **Webhook无法访问**
   - 检查防火墙设置
   - 确认n8n服务正常运行
   - 验证网络连通性

3. **响应超时**
   - 增加n8n超时设置
   - 优化代码节点性能

## 9. 高级配置

### 集成外部AI服务
在n8n工作流中添加OpenAI节点：

1. 添加HTTP请求节点调用OpenAI API
2. 配置API密钥和环境变量
3. 处理AI响应并格式化

### 数据库集成
使用n8n的PostgreSQL节点连接Supabase，实现：
- 用户对话历史存储
- 诗词数据查询
- 个性化推荐

## 10. 备份和恢复

定期备份工作流：
```bash
# 导出工作流
n8n export:workflow --id=workflow-id

# 导入工作流
n8n import:workflow --file=backup.json
```

完成以上步骤后，您的AI助手就可以正常工作了！