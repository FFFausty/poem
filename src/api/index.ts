import axios from 'axios'
import type { Poem, User } from '@/stores'

/**
 * API配置接口定义
 */
interface ApiConfig {
  baseURL: string
  timeout: number
  maxRetries: number
  retryDelay: number
}

/**
 * 请求配置
 */
const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000
}

/**
 * 创建axios实例
 */
const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求重试机制
 */
const retryRequest = async (config: any, retries: number = apiConfig.maxRetries): Promise<any> => {
  try {
    return await api(config)
  } catch (error) {
    if (retries > 0 && error?.code !== 'ECONNABORTED') {
      await new Promise(resolve => setTimeout(resolve, apiConfig.retryDelay))
      return retryRequest(config, retries - 1)
    }
    throw error
  }
}

/**
 * 请求拦截器 - 统一处理请求前逻辑
 */
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    
    // 添加认证Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器 - 统一处理响应逻辑
 */
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url} - Status: ${response.status}`)
    return response.data
  },
  (error) => {
    console.error('[API Response Error]', error)
    
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除Token并跳转登录
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足:', data.message)
          break
        case 404:
          // 资源不存在
          console.error('资源不存在:', data.message)
          break
        case 500:
          // 服务器错误
          console.error('服务器错误:', data.message)
          break
        default:
          console.error('请求错误:', data.message)
      }
    } else if (error.request) {
      // 网络错误
      console.error('网络错误:', error.message)
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * 诗词相关API接口
 */
export const poemApi = {
  /**
   * 获取诗词列表
   * @param params 查询参数
   * @returns 诗词列表和总数
   */
  getPoems: (params?: { 
    page?: number; 
    limit?: number; 
    dynasty?: string; 
    author?: string;
    tags?: string[];
  }) => retryRequest({
    method: 'get',
    url: '/poems',
    params
  }) as Promise<{ poems: Poem[]; total: number }>,
  
  /**
   * 获取诗词详情
   * @param id 诗词ID
   * @returns 诗词详情信息
   */
  getPoemById: (id: number) => retryRequest({
    method: 'get',
    url: `/poems/${id}`
  }) as Promise<Poem>,
  
  /**
   * 搜索诗词
   * @param keyword 搜索关键词
   * @param params 分页参数
   * @returns 搜索结果
   */
  searchPoems: (keyword: string, params?: { 
    page?: number; 
    limit?: number;
    searchType?: 'all' | 'title' | 'author' | 'content';
  }) => retryRequest({
    method: 'get',
    url: '/poems/search',
    params: { keyword, ...params }
  }) as Promise<{ poems: Poem[]; total: number }>,
  
  /**
   * 点赞诗词
   * @param id 诗词ID
   * @returns 操作结果
   */
  likePoem: (id: number) => retryRequest({
    method: 'post',
    url: `/poems/${id}/like`
  }) as Promise<{ success: boolean; likes: number }>,
  
  /**
   * 收藏诗词
   * @param id 诗词ID
   * @returns 操作结果
   */
  favoritePoem: (id: number) => retryRequest({
    method: 'post',
    url: `/poems/${id}/favorite`
  }) as Promise<{ success: boolean; favorites: number }>,
  
  /**
   * 获取随机诗词
   * @returns 随机诗词
   */
  getRandomPoem: () => retryRequest({
    method: 'get',
    url: '/poems/random'
  }) as Promise<Poem>
}

/**
 * 用户相关API接口
 */
export const userApi = {
  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 用户信息和Token
   */
  login: (credentials: { username: string; password: string }) => retryRequest({
    method: 'post',
    url: '/auth/login',
    data: credentials
  }) as Promise<{ user: User; token: string }>,
  
  /**
   * 用户注册
   * @param userData 用户注册信息
   * @returns 用户信息和Token
   */
  register: (userData: { username: string; email: string; password: string }) => retryRequest({
    method: 'post',
    url: '/auth/register',
    data: userData
  }) as Promise<{ user: User; token: string }>,
  
  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo: () => retryRequest({
    method: 'get',
    url: '/user/info'
  }) as Promise<User>,
  
  /**
   * 更新用户信息
   * @param userData 用户信息更新数据
   * @returns 更新后的用户信息
   */
  updateUserInfo: (userData: Partial<User>) => retryRequest({
    method: 'put',
    url: '/user/info',
    data: userData
  }) as Promise<User>,
  
  /**
   * 修改密码
   * @param passwordData 密码修改数据
   * @returns 操作结果
   */
  changePassword: (passwordData: { oldPassword: string; newPassword: string }) => retryRequest({
    method: 'post',
    url: '/user/change-password',
    data: passwordData
  }) as Promise<{ success: boolean }>
}

/**
 * 默认导出API实例
 */
export default api