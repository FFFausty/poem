/**
 * 诗词相关类型定义
 */

/**
 * 诗词基础信息接口
 */
export interface PoemBase {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  tags: string[]
  createdAt: string
}

/**
 * 诗词详情接口（包含扩展信息）
 */
export interface Poem extends PoemBase {
  annotations?: string[]
  translation?: string
  appreciation?: string
  likes: number
  favorites: number
  views: number
  rating?: number
}

/**
 * 诗词搜索参数接口
 */
export interface PoemSearchParams {
  keyword: string
  page?: number
  limit?: number
  dynasty?: string
  author?: string
  tags?: string[]
  searchType?: 'all' | 'title' | 'author' | 'content'
}

/**
 * 诗词列表响应接口
 */
export interface PoemListResponse {
  poems: Poem[]
  total: number
  page?: number
  limit?: number
  hasMore?: boolean
}

/**
 * 用户相关类型定义
 */

/**
 * 用户基础信息接口
 */
export interface UserBase {
  id: string
  username: string
  email: string
  createdAt: string
}

/**
 * 用户详情接口（包含扩展信息）
 */
export interface User extends UserBase {
  avatar?: string
  bio?: string
  level?: number
  points?: number
  isVerified?: boolean
  lastLogin?: string
  created_at?: string
  updated_at?: string
}

/**
 * 用户注册参数接口
 */
export interface RegisterParams {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

/**
 * 用户登录参数接口
 */
export interface LoginParams {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * 用户信息更新参数接口
 */
export interface UserUpdateParams {
  username?: string
  email?: string
  avatar?: string
  bio?: string
}

/**
 * API响应相关类型定义
 */

/**
 * 基础API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  code?: number
  timestamp: string
}

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  code: number
  message: string
  details?: any
  timestamp: string
}

/**
 * 组件相关类型定义
 */

/**
 * 按钮类型定义
 */
export type ButtonType = 'primary' | 'secondary' | 'success' | 'warning' | 'error'

/**
 * 按钮尺寸定义
 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * 表单字段验证规则接口
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

/**
 * 路由元信息接口
 */
export interface RouteMeta {
  title: string
  requiresAuth?: boolean
  roles?: string[]
  keepAlive?: boolean
  cacheKey?: string
}

/**
 * 主题配置类型定义
 */

/**
 * 颜色主题配置
 */
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  background: {
    primary: string
    secondary: string
  }
  text: {
    primary: string
    secondary: string
    disabled: string
  }
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  name: string
  colors: ThemeColors
  fontFamily: string
  borderRadius: string
  boxShadow: string
}

/**
 * 工具函数类型定义
 */

/**
 * 防抖函数配置
 */
export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

/**
 * 节流函数配置
 */
export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

/**
 * 本地存储配置
 */
export interface StorageConfig {
  prefix: string
  expire: number
}

/**
 * 事件总线事件类型
 */
export interface EventBusEvent {
  type: string
  payload?: any
  timestamp: number
}

/**
 * 性能监控指标
 */
export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

/**
 * 通用工具类型
 */

/**
 * 可选字段类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 必需字段类型
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * 深度可选类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 函数类型工具
 */

/**
 * 函数参数类型
 */
export type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never

/**
 * 函数返回类型
 */
export type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never

/**
 * 异步函数返回类型
 */
export type AsyncFunctionReturnType<T> = T extends (...args: any[]) => Promise<infer R> 
  ? R 
  : T extends (...args: any[]) => infer R 
    ? R 
    : never