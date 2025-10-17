import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams, UserUpdateParams } from '@/types'
import { supabaseAuthApi, supabaseUserApi } from '@/api/supabase'
import { supabase } from '@/lib/supabase'

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
      
      console.log('开始登录认证...')
      const result = await supabaseAuthApi.signIn(credentials.email, credentials.password)
      
      if (result.error) {
        console.error('认证失败:', result.error)
        throw result.error
      }
      
      console.log('认证API返回结果:', result)
      
      if (!result.data?.user) {
        console.error('认证返回的用户信息为空，完整结果:', result)
        throw new Error('登录失败：用户信息为空，请检查邮箱验证状态')
      }
      
      console.log('认证成功，开始获取用户详细信息...')
      // 获取用户详细信息
      const userInfo = await supabaseUserApi.getCurrentUser()
      console.log('用户信息获取成功:', userInfo)
      
      // 更新状态
      user.value = userInfo
      token.value = result.data.session?.access_token || null
      
      // 持久化存储
      if (result.data.session) {
        localStorage.setItem('token', result.data.session.access_token)
        localStorage.setItem('user', JSON.stringify(userInfo))
        console.log('用户信息已保存到本地存储')
      }
      
      console.log('登录流程完成')
      return true
    } catch (err: any) {
      console.error('登录错误详情:', {
        message: err.message,
        code: err.code,
        stack: err.stack,
        name: err.name
      })
      
      // 根据错误类型提供更友好的提示
      if (err.code === 'email_not_confirmed') {
        error.value = '邮箱未验证，请检查您的邮箱并点击验证链接'
      } else if (err.message?.includes('Invalid login credentials')) {
        error.value = '邮箱或密码错误，请重新输入'
      } else {
        error.value = err.message || '登录失败，请稍后重试'
      }
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
      
      console.log('开始用户注册...')
      const result = await supabaseAuthApi.signUp(userData.email, userData.password, userData.username)
      
      if (result.error) {
        console.error('注册失败:', result.error)
        throw result.error
      }
      
      // 注册成功，但需要邮箱验证
      if (result.data?.user) {
        console.log('注册成功，用户已创建:', result.data.user)
        return true
      }
      
      // 即使没有立即返回用户信息，只要没有错误就认为注册成功
      // Supabase可能需要邮箱验证，用户信息会在验证后可用
      console.log('注册成功，等待邮箱验证')
      return true
    } catch (err: any) {
      console.error('注册错误详情:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      })
      error.value = err.message || '注册失败，请稍后重试'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户退出登录操作
   */
  const logout = async (): Promise<void> => {
    try {
      await supabaseAuthApi.signOut()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 清除状态
      user.value = null
      token.value = null
      
      // 清除持久化存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 清除错误信息
      error.value = null
    }
  }

  /**
   * 获取用户信息操作
   * @returns 用户信息获取结果
   */
  const fetchUserInfo = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      console.log('开始获取用户信息...')
      const userInfo = await supabaseUserApi.getCurrentUser()
      console.log('用户信息获取成功:', userInfo)
      user.value = userInfo
      
      // 更新持久化存储
      localStorage.setItem('user', JSON.stringify(userInfo))
      console.log('用户信息已保存到本地存储')
      
      return true
    } catch (err: any) {
      console.error('获取用户信息失败:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      })
      // Token可能已失效，清除状态
      if (err.message.includes('未登录')) {
        console.log('Token已失效，执行退出登录')
        logout()
      }
      error.value = err.message || '获取用户信息失败'
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
      
      if (!user.value?.id) throw new Error('用户未登录')
      
      console.log('开始更新用户信息...')
      const updatedUser = await supabaseUserApi.updateUserProfile(user.value.id, userData)
      console.log('用户信息更新成功:', updatedUser)
      user.value = updatedUser
      
      // 更新持久化存储
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log('用户信息已保存到本地存储')
      
      return true
    } catch (err: any) {
      console.error('更新用户信息失败:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      })
      error.value = err.message || '更新用户信息失败'
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