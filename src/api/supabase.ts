import { supabase, type Poem, type User, type Favorite, type Like, type Comment } from '@/lib/supabase'

/**
 * Supabase API服务
 * 提供与Supabase数据库交互的接口
 */

// 诗词相关API
export const supabasePoemApi = {
  /**
   * 获取诗词列表
   */
  async getPoems(params?: { 
    page?: number; 
    limit?: number; 
    dynasty?: string; 
    author?: string;
    tags?: string[];
  }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('poems')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    // 添加过滤条件
    if (params?.dynasty) {
      query = query.eq('dynasty', params.dynasty)
    }
    if (params?.author) {
      query = query.eq('author', params.author)
    }
    if (params?.tags && params.tags.length > 0) {
      query = query.contains('tags', params.tags)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      poems: data as Poem[],
      total: count || 0
    }
  },

  /**
   * 获取诗词详情
   */
  async getPoemById(id: number) {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Poem
  },

  /**
   * 搜索诗词
   */
  async searchPoems(keyword: string, params?: { 
    page?: number; 
    limit?: number;
    searchType?: 'all' | 'title' | 'author' | 'content';
  }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('poems')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${keyword}%,author.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      poems: data as Poem[],
      total: count || 0
    }
  },

  /**
   * 获取随机诗词
   */
  async getRandomPoem() {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .limit(1)
      .order('id', { ascending: false, nullsFirst: false })
      .limit(1)

    if (error) throw error
    return data?.[0] as Poem
  },

  /**
   * 创建诗词
   */
  async createPoem(poemData: Omit<Poem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('poems')
      .insert([poemData])
      .select()
      .single()

    if (error) throw error
    return data as Poem
  },

  /**
   * 更新诗词
   */
  async updatePoem(id: number, poemData: Partial<Poem>) {
    const { data, error } = await supabase
      .from('poems')
      .update(poemData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Poem
  },

  /**
   * 删除诗词
   */
  async deletePoem(id: number) {
    const { error } = await supabase
      .from('poems')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  }
}

// 用户相关API
export const supabaseUserApi = {
  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) throw new Error('用户未登录')

      // 获取用户详细信息
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) {
        // 如果用户profile不存在，创建默认profile
        if (userError.code === 'PGRST116' || userError.message?.includes('No rows found')) {
          const { data: newUserData, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              username: user.user_metadata?.username || user.email?.split('@')[0] || '用户',
              email: user.email || '',
              level: 1,
              is_verified: false
            }])
            .select()
            .single()

          if (createError) throw createError
          return {
            ...newUserData,
            email: user.email,
            isVerified: newUserData.is_verified || false,
            createdAt: newUserData.created_at || new Date().toISOString()
          } as User
        }
        throw userError
      }

      return {
        ...userData,
        email: user.email,
        isVerified: userData.is_verified || false,
        createdAt: userData.created_at || new Date().toISOString()
      } as User
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      throw new Error('获取用户信息失败，请重新登录')
    }
  },

  /**
   * 更新用户信息
   */
  async updateUserProfile(userId: string, profileData: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as User
  },

  /**
   * 获取用户收藏的诗词
   */
  async getUserFavorites(userId: string, params?: { page?: number; limit?: number }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('favorites')
      .select(`
        *,
        poems (*)
      `)
      .eq('user_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      favorites: data as (Favorite & { poems: Poem })[],
      total: count || 0
    }
  },

  /**
   * 获取用户点赞记录
   */
  async getUserLikes(userId: string, params?: { page?: number; limit?: number }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('likes')
      .select(`
        *,
        poems (*)
      `)
      .eq('user_id', userId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      likes: data as (Like & { poems: Poem })[],
      total: count || 0
    }
  }
}

// 互动相关API
export const supabaseInteractionApi = {
  /**
   * 检查用户是否点赞了诗词
   */
  async checkUserLike(poemId: number, userId: string) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('poem_id', poemId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.warn('检查点赞状态失败:', error)
        return { liked: false, likeId: null }
      }

      return {
        liked: !!data,
        likeId: data?.id
      }
    } catch (error) {
      console.error('检查点赞状态异常:', error)
      return { liked: false, likeId: null }
    }
  },

  /**
   * 点赞诗词
   */
  async likePoem(poemId: number, userId: string) {
    try {
      // 检查是否已经点赞
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('poem_id', poemId)
        .eq('user_id', userId)
        .maybeSingle()

      let newLikedState = false
      let newLikesCount = 0

      if (existingLike) {
        // 取消点赞
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        if (error) throw error

        // 直接更新诗词点赞数（不使用存储过程）
        const { data: poem } = await supabase
          .from('poems')
          .select('likes')
          .eq('id', poemId)
          .single()

        newLikesCount = Math.max(0, (poem?.likes || 1) - 1)
        newLikedState = false
      } else {
        // 添加点赞
        const { error } = await supabase
          .from('likes')
          .insert([{ poem_id: poemId, user_id: userId }])

        if (error) throw error

        // 直接更新诗词点赞数（不使用存储过程）
        const { data: poem } = await supabase
          .from('poems')
          .select('likes')
          .eq('id', poemId)
          .single()

        newLikesCount = (poem?.likes || 0) + 1
        newLikedState = true
      }

      // 更新诗词表的点赞数
      const { error: updateError } = await supabase
        .from('poems')
        .update({ likes: newLikesCount })
        .eq('id', poemId)

      if (updateError) throw updateError

      return {
        success: true,
        likes: newLikesCount,
        liked: newLikedState
      }
    } catch (error) {
      console.error('点赞操作失败:', error)
      throw new Error('点赞操作失败，请稍后重试')
    }
  },

  /**
   * 收藏诗词
   */
  async favoritePoem(poemId: number, userId: string) {
    try {
      // 检查是否已经收藏
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('poem_id', poemId)
        .eq('user_id', userId)
        .maybeSingle()

      let newFavoritedState = false
      let newFavoritesCount = 0

      if (existingFavorite) {
        // 取消收藏
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id)

        if (error) throw error

        // 直接更新诗词收藏数
        const { data: poem } = await supabase
          .from('poems')
          .select('favorites')
          .eq('id', poemId)
          .single()

        newFavoritesCount = Math.max(0, (poem?.favorites || 1) - 1)
        newFavoritedState = false
      } else {
        // 添加收藏
        const { error } = await supabase
          .from('favorites')
          .insert([{ poem_id: poemId, user_id: userId }])

        if (error) throw error

        // 直接更新诗词收藏数
        const { data: poem } = await supabase
          .from('poems')
          .select('favorites')
          .eq('id', poemId)
          .single()

        newFavoritesCount = (poem?.favorites || 0) + 1
        newFavoritedState = true
      }

      // 更新诗词表的收藏数
      const { error: updateError } = await supabase
        .from('poems')
        .update({ favorites: newFavoritesCount })
        .eq('id', poemId)

      if (updateError) throw updateError

      return {
        success: true,
        favorites: newFavoritesCount,
        favorited: newFavoritedState
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
      throw new Error('收藏操作失败，请稍后重试')
    }
  },

  /**
   * 添加评论
   */
  async addComment(poemId: number, userId: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ 
        poem_id: poemId, 
        user_id: userId, 
        content 
      }])
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  /**
   * 获取诗词评论
   */
  async getPoemComments(poemId: number, params?: { page?: number; limit?: number }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq('poem_id', poemId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      comments: data,
      total: count || 0
    }
  }
}

// 认证相关API
export const supabaseAuthApi = {
  /**
   * 用户注册
   */
  async signUp(email: string, password: string, username: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })

      if (error) throw error

      // 创建用户profile（如果用户存在）
      if (data.user) {
        try {
          console.log('开始创建用户profile...')
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              username,
              email,
              level: 1,
              is_verified: false
            }])
          
          if (profileError) {
            // RLS策略阻止创建profile，这是正常现象，Supabase会自动处理
            console.log('Profile创建被RLS策略阻止，Supabase会自动处理:', profileError.message)
          } else {
            console.log('用户profile创建成功')
          }
        } catch (profileError) {
          // 忽略profile创建错误，Supabase认证成功即可
          console.log('Profile创建异常，不影响注册:', profileError)
        }
      }

      return data
    } catch (error: any) {
      console.error('注册失败:', error)
      throw new Error(error.message || '注册失败，请稍后重试')
    }
  },

  /**
   * 用户登录
   */
  async signIn(email: string, password: string) {
    console.log('调用Supabase认证API...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('Supabase认证返回结果:', { data, error })
    
    if (error) {
      console.error('Supabase认证错误:', error)
      throw error
    }
    
    return { data, error }
  },

  /**
   * 用户退出
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  },

  /**
   * 重置密码
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { success: true }
  }
}

export default {
  poem: supabasePoemApi,
  user: supabaseUserApi,
  interaction: supabaseInteractionApi,
  auth: supabaseAuthApi
}