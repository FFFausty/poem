import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams, UserUpdateParams } from '@/types'
import { userApi } from '@/api'

/**
 * 用户状态管理 Store
 * 负责管理用户认证状态、用户信息和相关操作
 */
export const useUserStore = defineStore('user', () => {
  // 状态定义
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  
  // 加载状态
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 用户登录操作
   * @param credentials 登录凭证
   * @returns 登录结果
   */
  const login = async (credentials: LoginParams): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await userApi.login(credentials)
      
      // 更新状态
      user.value = response.user
      token.value = response.token
      
      // 持久化存储
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败，请检查用户名和密码'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户注册操作
   * @param userData 用户注册信息
   * @returns 注册结果
   */
  const register = async (userData: RegisterParams): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await userApi.register(userData)
      
      // 更新状态
      user.value = response.user
      token.value = response.token
      
      // 持久化存储
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户退出登录操作
   */
  const logout = (): void => {
    // 清除状态
    user.value = null
    token.value = null
    
    // 清除持久化存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 清除错误信息
    error.value = null
  }

  /**
   * 获取用户信息操作
   * @returns 用户信息获取结果
   */
  const fetchUserInfo = async (): Promise<boolean> => {
    if (!token.value) {
      return false
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      const userInfo = await userApi.getUserInfo()
      user.value = userInfo
      
      // 更新持久化存储
      localStorage.setItem('user', JSON.stringify(userInfo))
      
      return true
    } catch (err: any) {
      // Token可能已失效，清除状态
      if (err.response?.status === 401) {
        logout()
      }
      error.value = err.response?.data?.message || '获取用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新用户信息操作
   * @param userData 用户信息更新数据
   * @returns 更新结果
   */
  const updateUserInfo = async (userData: UserUpdateParams): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedUser = await userApi.updateUserInfo(userData)
      user.value = updatedUser
      
      // 更新持久化存储
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 初始化用户状态
   * 从本地存储恢复用户信息
   */
  const initialize = (): void => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch {
        // 解析失败，清除无效数据
        logout()
      }
    }
  }

  /**
   * 清除错误信息
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * 重置加载状态
   */
  const resetLoading = (): void => {
    isLoading.value = false
  }

  // 计算属性
  const userDisplayName = computed(() => {
    return user.value?.username || '用户'
  })

  const userLevel = computed(() => {
    return user.value?.level || 1
  })

  const isVerified = computed(() => {
    return user.value?.isVerified || false
  })

  // 返回状态和方法
  return {
    // 状态
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    
    // 计算属性
    userDisplayName,
    userLevel,
    isVerified,
    
    // 方法
    login,
    register,
    logout,
    fetchUserInfo,
    updateUserInfo,
    initialize,
    clearError,
    resetLoading
  }
})

/**
 * 用户 Store 类型导出
 */
export type UserStore = ReturnType<typeof useUserStore>