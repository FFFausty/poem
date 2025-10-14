import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Poem, PoemSearchParams, PoemListResponse } from '@/types'
import { poemApi } from '@/api'

/**
 * 诗词状态管理 Store
 * 负责管理诗词数据、搜索状态和相关操作
 */
export const usePoemStore = defineStore('poem', () => {
  // 状态定义
  const poems = ref<Poem[]>([])
  const currentPoem = ref<Poem | null>(null)
  const searchResults = ref<Poem[]>([])
  const favorites = ref<Poem[]>([])
  
  // 分页状态
  const currentPage = ref(1)
  const totalPages = ref(0)
  const totalCount = ref(0)
  const hasMore = ref(true)
  
  // 搜索状态
  const searchQuery = ref('')
  const searchFilters = ref({
    dynasty: '',
    author: '',
    tags: [] as string[]
  })
  
  // 加载状态
  const isLoading = ref(false)
  const isSearching = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取诗词列表操作
   * @param page 页码
   * @param limit 每页数量
   * @param filters 筛选条件
   * @returns 获取结果
   */
  const fetchPoems = async (
    page: number = 1,
    limit: number = 10,
    filters?: { dynasty?: string; author?: string; tags?: string[] }
  ): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: PoemListResponse = await poemApi.getPoems({
        page,
        limit,
        ...filters
      })
      
      // 更新状态
      if (page === 1) {
        poems.value = response.poems
      } else {
        poems.value = [...poems.value, ...response.poems]
      }
      
      currentPage.value = page
      totalCount.value = response.total
      totalPages.value = Math.ceil(response.total / limit)
      hasMore.value = response.hasMore
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取诗词列表失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 搜索诗词操作
   * @param keyword 搜索关键词
   * @param params 搜索参数
   * @returns 搜索结果
   */
  const searchPoems = async (
    keyword: string,
    params?: { page?: number; limit?: number; searchType?: 'all' | 'title' | 'author' | 'content' }
  ): Promise<boolean> => {
    try {
      isSearching.value = true
      error.value = null
      searchQuery.value = keyword
      
      const response: PoemListResponse = await poemApi.searchPoems(keyword, params)
      
      // 更新搜索状态
      if (params?.page === 1 || !params?.page) {
        searchResults.value = response.poems
      } else {
        searchResults.value = [...searchResults.value, ...response.poems]
      }
      
      currentPage.value = params?.page || 1
      totalCount.value = response.total
      hasMore.value = response.hasMore
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '搜索诗词失败'
      return false
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 获取诗词详情操作
   * @param id 诗词ID
   * @returns 获取结果
   */
  const fetchPoemById = async (id: number): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const poem = await poemApi.getPoemById(id)
      currentPoem.value = poem
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取诗词详情失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 点赞诗词操作
   * @param id 诗词ID
   * @returns 点赞结果
   */
  const likePoem = async (id: number): Promise<boolean> => {
    try {
      const response = await poemApi.likePoem(id)
      
      // 更新本地状态
      const poemIndex = poems.value.findIndex(p => p.id === id)
      if (poemIndex !== -1) {
        poems.value[poemIndex].likes = response.likes
      }
      
      if (currentPoem.value?.id === id) {
        currentPoem.value.likes = response.likes
      }
      
      return response.success
    } catch (err: any) {
      error.value = err.response?.data?.message || '点赞失败'
      return false
    }
  }

  /**
   * 收藏诗词操作
   * @param id 诗词ID
   * @returns 收藏结果
   */
  const favoritePoem = async (id: number): Promise<boolean> => {
    try {
      const response = await poemApi.favoritePoem(id)
      
      // 更新本地状态
      const poemIndex = poems.value.findIndex(p => p.id === id)
      if (poemIndex !== -1) {
        poems.value[poemIndex].favorites = response.favorites
      }
      
      if (currentPoem.value?.id === id) {
        currentPoem.value.favorites = response.favorites
      }
      
      return response.success
    } catch (err: any) {
      error.value = err.response?.data?.message || '收藏失败'
      return false
    }
  }

  /**
   * 获取随机诗词操作
   * @returns 随机诗词
   */
  const getRandomPoem = async (): Promise<Poem | null> => {
    try {
      const poem = await poemApi.getRandomPoem()
      return poem
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取随机诗词失败'
      return null
    }
  }

  /**
   * 清除搜索状态
   */
  const clearSearch = (): void => {
    searchQuery.value = ''
    searchResults.value = []
    searchFilters.value = {
      dynasty: '',
      author: '',
      tags: []
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
    isSearching.value = false
  }

  // 计算属性
  const displayedPoems = computed(() => {
    return searchQuery.value ? searchResults.value : poems.value
  })

  const searchStats = computed(() => {
    return {
      query: searchQuery.value,
      count: searchResults.value.length,
      total: totalCount.value
    }
  })

  const filterStats = computed(() => {
    const activeFilters = Object.entries(searchFilters.value)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return value !== ''
      })
      .map(([key]) => key)
    
    return {
      activeFilters,
      count: activeFilters.length
    }
  })

  // 返回状态和方法
  return {
    // 状态
    poems,
    currentPoem,
    searchResults,
    favorites,
    currentPage,
    totalPages,
    totalCount,
    hasMore,
    searchQuery,
    searchFilters,
    isLoading,
    isSearching,
    error,
    
    // 计算属性
    displayedPoems,
    searchStats,
    filterStats,
    
    // 方法
    fetchPoems,
    searchPoems,
    fetchPoemById,
    likePoem,
    favoritePoem,
    getRandomPoem,
    clearSearch,
    clearError,
    resetLoading
  }
})

/**
 * 诗词 Store 类型导出
 */
export type PoemStore = ReturnType<typeof usePoemStore>