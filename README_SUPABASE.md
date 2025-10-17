# Supabase 集成指南

## 📋 概述

诗词赏析网站已成功集成 Supabase 后端服务，提供完整的用户认证、数据存储和实时功能。

## 🚀 快速开始

### 1. 环境配置

确保在 `.env` 文件中配置正确的 Supabase 环境变量：

```env
VITE_SUPABASE_URL=https://gmpifcojnkhfypdwmoxt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcGlmY29qbmtoZnlwZHdtb3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg3MzksImV4cCI6MjA3NjA0NDczOX0.86dT2qZ-pHlCaBKP1vHrN7D3uggl5Ow8jeVjLMg7uvk
```

### 2. 数据库部署

#### 方法一：使用 Supabase 控制台

1. 登录 [Supabase 控制台](https://supabase.com/dashboard)
2. 选择项目 `try1` (ID: gmpifcojnkhfypdwmoxt)
3. 进入 **SQL Editor**
4. 复制并执行 `supabase/migrations/001_initial_schema.sql`
5. 执行 `supabase/seed_data.sql` 插入示例数据

#### 方法二：使用 CLI（推荐）

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 部署数据库
cd poem
./supabase/deploy.sh
```

### 3. 验证部署

部署完成后，在 Supabase 控制台中检查：

- **Table Editor**: 确认表结构正确创建
- **Authentication**: 确认用户认证功能正常
- **SQL Editor**: 可以执行查询测试

## 🗄️ 数据库结构

### 核心表

#### `poems` - 诗词表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| title | VARCHAR(255) | 诗词标题 |
| author | VARCHAR(100) | 作者 |
| dynasty | VARCHAR(50) | 朝代 |
| content | TEXT | 诗词内容 |
| category | VARCHAR(100) | 分类 |
| tags | TEXT[] | 标签数组 |
| analysis | TEXT | 赏析 |
| likes | INTEGER | 点赞数 |
| favorites | INTEGER | 收藏数 |
| image | VARCHAR(500) | 图片URL |

#### `profiles` - 用户资料表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 用户ID（关联auth.users） |
| username | VARCHAR(100) | 用户名 |
| email | VARCHAR(255) | 邮箱 |
| avatar_url | VARCHAR(500) | 头像URL |
| level | INTEGER | 用户等级 |
| is_verified | BOOLEAN | 是否验证 |

#### `favorites` - 收藏表
#### `likes` - 点赞表  
#### `comments` - 评论表

## 🔐 认证系统

### 用户注册
```typescript
import { supabaseAuthApi } from '@/api/supabase'

const { data, error } = await supabaseAuthApi.signUp(
  'user@example.com',
  'password123',
  'username'
)
```

### 用户登录
```typescript
const { data, error } = await supabaseAuthApi.signIn(
  'user@example.com', 
  'password123'
)
```

### 会话管理
- 自动处理 Token 刷新
- 持久化会话存储
- 路由守卫集成

## 📊 API 功能

### 诗词相关
- `getPoems()` - 获取诗词列表（支持分页、过滤）
- `getPoemById()` - 获取诗词详情
- `searchPoems()` - 搜索诗词
- `createPoem()` - 创建诗词（需要认证）

### 用户互动
- `likePoem()` - 点赞/取消点赞
- `favoritePoem()` - 收藏/取消收藏  
- `addComment()` - 添加评论
- `getUserFavorites()` - 获取用户收藏

### 用户管理
- `getCurrentUser()` - 获取当前用户信息
- `updateUserProfile()` - 更新用户资料

## 🔒 安全特性

### 行级安全 (RLS)
所有表都启用了行级安全策略：

- **诗词表**: 所有人可读，认证用户可写
- **用户资料**: 可查看所有资料，只能更新自己的
- **互动表**: 可查看所有数据，只能管理自己的

### 数据验证
- 输入数据验证和清理
- SQL 注入防护
- 文件上传类型限制

## 🚀 部署指南

### 生产环境部署

1. **环境变量配置**
```env
# 生产环境
VITE_SUPABASE_URL=你的生产环境URL
VITE_SUPABASE_ANON_KEY=你的生产环境密钥
```

2. **构建应用**
```bash
npm run build
```

3. **部署到 Vercel/Netlify**
- 连接 Git 仓库
- 配置环境变量
- 自动部署

### 数据库备份
```sql
-- 定期备份重要数据
pg_dump -h your-db-host -U your-username -d your-database > backup.sql
```

## 🐛 故障排除

### 常见问题

**1. 连接失败**
```bash
# 检查网络连接
ping gmpifcojnkhfypdwmoxt.supabase.co

# 检查环境变量
echo $VITE_SUPABASE_URL
```

**2. 认证错误**
- 检查 Token 是否过期
- 验证邮箱是否已验证
- 检查密码强度要求

**3. 权限错误**
- 确认 RLS 策略正确配置
- 检查用户角色权限

### 日志查看
```bash
# 查看 Supabase 日志
supabase logs --project-ref your-project-id
```

## 📈 性能优化

### 数据库优化
- 为常用查询字段创建索引
- 使用连接池管理数据库连接
- 定期清理过期数据

### 前端优化
- 实现数据缓存
- 使用分页加载大量数据
- 图片懒加载和压缩

## 🔮 后续开发

### 计划功能
- [ ] 实时诗词推送
- [ ] 诗词朗诵音频
- [ ] 社交分享功能
- [ ] 移动端应用

### 扩展建议
- 集成 AI 诗词生成
- 添加学习进度跟踪
- 实现多语言支持

---

**如有问题，请查看 [Supabase 文档](https://supabase.com/docs) 或提交 Issue。**