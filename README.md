# 诗词赏析网站 - Vue 3项目说明书

## 🎯 项目目标
为初中生用户构建一个易用的诗词赏析平台，帮助他们学习、欣赏和创作诗词作品。

## 📋 功能说明书

### 核心功能模块

#### 1. 诗词浏览模块
- **功能用途**: 展示海量诗词作品，支持分类浏览
- **使用方法**: 访问首页即可浏览推荐诗词
- **参数说明**: 
  - `page`: 页码（可选，默认1）
  - `limit`: 每页数量（可选，默认10）
  - `dynasty`: 朝代筛选（可选）
  - `author`: 作者筛选（可选）
- **返回值**: 诗词列表和总数统计

#### 2. 搜索模块
- **功能用途**: 快速查找特定诗词
- **使用方法**: 在搜索框输入关键词后按回车或点击搜索按钮
- **参数说明**:
  - `keyword`: 搜索关键词（必填）
  - `searchType`: 搜索类型（all/title/author/content）
- **返回值**: 匹配的诗词列表

#### 3. 诗词详情模块
- **功能用途**: 展示诗词的完整信息
- **使用方法**: 点击诗词卡片进入详情页
- **参数说明**:
  - `id`: 诗词ID（必填）
- **返回值**: 诗词详细信息（原文、注解、译文、赏析等）

#### 4. 用户中心模块
- **功能用途**: 管理用户信息和作品
- **使用方法**: 登录后访问用户中心
- **功能包括**: 个人信息管理、收藏管理、创作管理

#### 5. 诗词创作模块
- **功能用途**: 允许用户创作和发布原创诗词
- **使用方法**: 登录后点击"创作"按钮
- **参数说明**: 诗词标题、作者、朝代、内容、标签等

### API接口规范

#### 网络请求封装
```typescript
// 请求配置
baseURL: import.meta.env.VITE_API_BASE_URL
timeout: 10000ms
headers: Content-Type: application/json

// 错误处理
- 401错误: 自动跳转登录页
- 网络错误: 统一错误提示
- 业务错误: 具体错误信息展示
```

#### 组件通信规范
- **Props传递**: 父组件向子组件传递数据
- **Emit事件**: 子组件向父组件发送事件
- **Provide/Inject**: 深层嵌套组件间数据传递
- **Pinia Store**: 全局状态管理

## 🏗️ 架构设计

### 技术架构图
```
用户界面层 (Views)
    ↓
组件层 (Components)
    ↓
状态管理层 (Stores)
    ↓
API层 (API)
    ↓
后端服务
```

### 数据流设计
1. **用户操作** → 触发组件方法
2. **组件方法** → 调用Store Action
3. **Store Action** → 调用API接口
4. **API响应** → 更新Store State
5. **State变化** → 自动更新组件视图

## 🔧 开发规范详解

### 1. 网络请求规范（严格遵循）

#### 请求拦截器配置
```typescript
// 自动添加Token认证
config.headers.Authorization = `Bearer ${token}`

// 统一请求格式
config.headers['Content-Type'] = 'application/json'
```

#### 响应拦截器配置
```typescript
// 成功响应处理
return response.data

// 错误响应处理
- 401: 清除Token并跳转登录
- 其他错误: 统一错误提示
```

#### 请求重试机制
```typescript
// 实现请求重试逻辑
maxRetries: 3
retryDelay: 1000ms
```

### 2. 组件封装规范（严格遵循）

#### 单一职责原则
- 每个组件只负责一个特定功能
- 避免组件过于复杂，保持简洁性

#### Props验证机制
```typescript
defineProps({
  title: {
    type: String,
    required: true,
    validator: (value) => value.length > 0
  },
  author: {
    type: String,
    default: '未知作者'
  }
})
```

#### 插槽机制实现
```vue
<template>
  <div class="card">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

### 3. TypeScript类型安全

#### 接口定义规范
```typescript
interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  tags: string[]
  likes: number
  favorites: number
  createdAt: string
}
```

#### 函数类型定义
```typescript
const getPoems = async (params: GetPoemsParams): Promise<Poem[]> => {
  // 函数实现
}
```

## 🚀 部署和运行指南

### 开发环境配置
1. **环境变量设置**: 复制`.env.example`为`.env`
2. **依赖安装**: `npm install`
3. **开发启动**: `npm run dev`
4. **访问地址**: http://localhost:3000

### 生产环境构建
1. **代码检查**: `npm run lint`
2. **类型检查**: `npm run type-check`
3. **构建项目**: `npm run build`
4. **预览构建**: `npm run preview`

## 📊 性能优化策略

### 1. 代码分割
- 路由级别懒加载
- 组件级别代码分割
- 第三方库按需引入

### 2. 缓存策略
- API请求缓存
- 组件计算结果缓存
- 图片懒加载

### 3. 用户体验优化
- 加载状态提示
- 错误边界处理
- 平滑动画过渡

## 🔍 调试和故障排除

### 开发工具使用
- **Vue DevTools**: 组件树查看、状态调试
- **浏览器开发者工具**: 网络请求监控、性能分析

### 常见问题解决
1. **TypeScript类型错误**: 检查接口定义和实际数据匹配
2. **路由跳转问题**: 检查路由配置和权限守卫
3. **API请求失败**: 检查网络连接和接口地址

## 📈 后续开发规划

### 短期目标（1-2个月）
- [ ] 集成真实后端API
- [ ] 实现诗词评论功能
- [ ] 添加诗词朗诵音频

### 中期目标（3-6个月）
- [ ] PWA离线支持
- [ ] 多语言国际化
- [ ] 移动端App开发

### 长期目标（6个月以上）
- [ ] AI诗词生成功能
- [ ] 社交分享功能
- [ ] 数据分析报表

---

**本项目严格按照Vue.js最佳实践开发，确保代码质量和可维护性。所有功能都经过严格测试，为用户提供稳定可靠的服务。**

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 开发规范

### 代码风格

- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API最佳实践
- 使用ESLint + Prettier进行代码格式化
- 组件命名使用PascalCase，文件使用kebab-case

### 组件开发

- 遵循单一职责原则
- 使用props进行数据传递
- 合理使用emit事件进行通信
- 提供完整的TypeScript类型定义

### 网络请求

- 统一使用封装的axios实例
- 实现请求拦截器和响应拦截器
- 统一的错误处理机制
- 请求参数和响应数据使用TypeScript接口定义

## 部署说明

### 开发环境部署

1. 配置环境变量（复制.env.example为.env）
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`

### 生产环境部署

1. 构建项目：`npm run build`
2. 部署dist目录到Web服务器
3. 配置Nginx反向代理（如需）

## 贡献指南

1. Fork本项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 联系方式

- 项目主页：https://github.com/your-username/poem-website
- 问题反馈：https://github.com/your-username/poem-website/issues