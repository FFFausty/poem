import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem } from '@/lib/supabase'
import { supabasePoemApi, supabaseInteractionApi, supabaseUserApi } from '@/api/supabase'
import { useUserStore } from './user'

/**
 * 诗词状态管理 Store
 * 负责管理诗词数据、搜索和互动功能
 */
export const usePoemStore = defineStore('poem', () => {
  const userStore = useUserStore()
  
  // 状态定义
  const poems = ref<Poem[]>([])
  const currentPoem = ref<Poem | null>(null)
  const searchResults = ref<Poem[]>([])
  const favorites = ref<Poem[]>([])
  
  // 分页信息
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false
  })
  
  // 加载状态
  const isLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取诗词列表
   */
  const fetchPoems = async (params?: { 
    page?: number; 
    limit?: number; 
    dynasty?: string; 
    author?: string;
    tags?: string[];
  }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await supabasePoemApi.getPoems(params)
      poems.value = result.poems
      pagination.value = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: result.total,
        hasNext: (params?.page || 1) * (params?.limit || 10) < result.total,
        hasPrev: (params?.page || 1) > 1
      }
    } catch (err: any) {
      error.value = err.message || '获取诗词列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取诗词详情
   */
  const fetchPoemById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const poem = await supabasePoemApi.getPoemById(id)
      currentPoem.value = poem
      return poem
    } catch (err: any) {
      error.value = err.message || '获取诗词详情失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 搜索诗词
   */
  const searchPoems = async (keyword: string, params?: { 
    page?: number; 
    limit?: number;
    searchType?: 'all' | 'title' | 'author' | 'content';
  }) => {
    try {
      isSearching.value = true
      error.value = null
      
      const result = await supabasePoemApi.searchPoems(keyword, params)
      searchResults.value = result.poems
      pagination.value = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: result.total,
        hasNext: (params?.page || 1) * (params?.limit || 10) < result.total,
        hasPrev: (params?.page || 1) > 1
      }
    } catch (err: any) {
      error.value = err.message || '搜索诗词失败'
      throw err
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 获取随机诗词
   */
  const fetchRandomPoem = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const poem = await supabasePoemApi.getRandomPoem()
      return poem
    } catch (err: any) {
      error.value = err.message || '获取随机诗词失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 检查用户是否点赞了诗词
   */
  const checkUserLike = async (poemId: number) => {
    try {
      if (!userStore.isLoggedIn) {
        return { liked: false }
      }
      
      const result = await supabaseInteractionApi.checkUserLike(poemId, userStore.user!.id)
      return result
    } catch (err: any) {
      console.error('检查点赞状态失败:', err)
      return { liked: false }
    }
  }

  /**
   * 点赞诗词
   */
  const likePoem = async (poemId: number) => {
    try {
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录')
      }
      
      const result = await supabaseInteractionApi.likePoem(poemId, userStore.user!.id)
      
      // 更新本地状态
      if (currentPoem.value?.id === poemId) {
        currentPoem.value.likes = result.likes
      }
      
      const poemIndex = poems.value.findIndex(p => p.id === poemId)
      if (poemIndex !== -1) {
        poems.value[poemIndex].likes = result.likes
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || '点赞失败'
      throw err
    }
  }

  /**
   * 收藏诗词
   */
  const favoritePoem = async (poemId: number) => {
    try {
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录')
      }
      
      const result = await supabaseInteractionApi.favoritePoem(poemId, userStore.user!.id)
      
      // 更新本地状态
      if (currentPoem.value?.id === poemId) {
        currentPoem.value.favorites = result.favorites
      }
      
      const poemIndex = poems.value.findIndex(p => p.id === poemId)
      if (poemIndex !== -1) {
        poems.value[poemIndex].favorites = result.favorites
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || '收藏失败'
      throw err
    }
  }

  /**
   * 获取用户收藏
   */
  const fetchUserFavorites = async (params?: { page?: number; limit?: number }) => {
    try {
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录')
      }
      
      isLoading.value = true
      error.value = null
      
      const result = await supabaseUserApi.getUserFavorites(userStore.user!.id, params)
      favorites.value = result.favorites.map(fav => fav.poems)
      pagination.value = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: result.total,
        hasNext: (params?.page || 1) * (params?.limit || 10) < result.total,
        hasPrev: (params?.page || 1) > 1
      }
    } catch (err: any) {
      error.value = err.message || '获取收藏列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取用户点赞记录
   */
  const fetchUserLikes = async (params?: { page?: number; limit?: number }) => {
    try {
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录')
      }
      
      isLoading.value = true
      error.value = null
      
      const result = await supabaseUserApi.getUserLikes(userStore.user!.id, params)
      return result
    } catch (err: any) {
      error.value = err.message || '获取点赞记录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除搜索结果
   */
  const clearSearchResults = () => {
    searchResults.value = []
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      hasNext: false,
      hasPrev: false
    }
  }

  /**
   * 清除错误信息
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 重置状态
   */
  const reset = () => {
    poems.value = []
    currentPoem.value = null
    searchResults.value = []
    favorites.value = []
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      hasNext: false,
      hasPrev: false
    }
    error.value = null
  }

  // 计算属性
  const hasPoems = computed(() => poems.value.length > 0)
  const hasSearchResults = computed(() => searchResults.value.length > 0)
  const hasFavorites = computed(() => favorites.value.length > 0)

  return {
    // 状态
    poems,
    currentPoem,
    searchResults,
    favorites,
    pagination,
    isLoading,
    isSearching,
    error,
    
    // 计算属性
    hasPoems,
    hasSearchResults,
    hasFavorites,
    
    // 方法
    fetchPoems,
    fetchPoemById,
    searchPoems,
    fetchRandomPoem,
    checkUserLike,
    likePoem,
    favoritePoem,
    fetchUserFavorites,
    fetchUserLikes,
    clearSearchResults,
    clearError,
    reset
  }
})

/**
 * 诗词 Store 类型导出
 */
export type PoemStore = ReturnType<typeof usePoemStore>