import { createClient } from '@supabase/supabase-js'

// Supabase客户端配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少Supabase环境变量配置')
}

// 创建Supabase客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// 导出类型定义
export type Poem = {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  category: string
  tags: string[]
  analysis: string
  likes: number
  favorites: number
  image: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  username: string
  avatar_url?: string
  level: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Favorite = {
  id: number
  user_id: string
  poem_id: number
  created_at: string
}

export type Like = {
  id: number
  user_id: string
  poem_id: number
  created_at: string
}

export type Comment = {
  id: number
  user_id: string
  poem_id: number
  content: string
  created_at: string
  updated_at: string
}

export default supabase