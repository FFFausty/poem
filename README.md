# 诗韵雅集 - 诗词赏析网站

基于Vue 3 + TypeScript + TailwindCSS的现代化诗词赏析平台，集成了MasterGo设计稿。

## 功能特性

- 🎨 现代化UI设计，响应式布局
- 📱 移动端友好，支持多种设备
- ⚡ Vue 3 Composition API + TypeScript
- 🎯 集成MasterGo设计稿
- 🔧 TailwindCSS + FontAwesome图标
- 📊 诗词分类、热门排行、评论系统

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式框架**: TailwindCSS
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **HTTP客户端**: Axios
- **图标库**: FontAwesome
- **轮播组件**: Swiper

## 项目结构

```
src/
├── api/           # API接口
├── assets/        # 静态资源
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── types/         # 类型定义
├── utils/         # 工具函数
└── views/         # 页面组件
```

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署指南

### Vercel部署

1. 将项目推送到GitHub仓库
2. 访问 [Vercel](https://vercel.com/)
3. 连接GitHub账户，导入项目
4. 配置构建设置：
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击部署

### 环境变量

复制 `.env.example` 为 `.env` 并配置相应环境变量：

```bash
cp .env.example .env
```

## 页面说明

- **首页** (`/`): MasterGo设计的现代化诗词首页
- **经典首页** (`/classic`): 传统风格首页
- **搜索页面** (`/search`): 诗词搜索和分类
- **诗词详情** (`/poem/:id`): 诗词详情和赏析
- **用户中心** (`/user`): 个人收藏和设置
- **登录注册** (`/login`, `/register`): 用户认证

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

- 项目地址: [https://github.com/FFFausty/poem](https://github.com/FFFausty/poem)
- 问题反馈: [GitHub Issues](https://github.com/FFFausty/poem/issues)

---

**诗韵雅集** - 传承中华文化，品味诗词之美