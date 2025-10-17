/**
 * 路由守卫配置
 * 提供全局路由守卫和权限控制功能
 */

import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/stores'

/**
 * 路由守卫类型定义
 */
export type RouteGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => void | Promise<void>

/**
 * 认证守卫 - 检查用户是否已登录
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const authGuard: RouteGuard = (to, from, next) => {
  const userStore = useUserStore()
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  
  if (requiresAuth && !userStore.isLoggedIn) {
    // 未登录且需要认证，重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

/**
 * 角色守卫 - 检查用户角色权限
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const roleGuard: RouteGuard = (to, from, next) => {
  const userStore = useUserStore()
  const requiredRoles = to.meta?.roles as string[]
  
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = userStore.user?.level?.toString() || '1'
    
    if (!requiredRoles.includes(userRole)) {
      // 角色权限不足，重定向到无权限页面
      next({ path: '/403' })
      return
    }
  }
  
  next()
}

/**
 * 页面标题守卫 - 动态设置页面标题
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const titleGuard: RouteGuard = (to, from, next) => {
  const pageTitle = to.meta?.title as string
  const appName = '诗词赏析'
  
  if (pageTitle) {
    document.title = `${pageTitle} - ${appName}`
  } else {
    document.title = appName
  }
  
  next()
}

/**
 * 滚动行为守卫 - 控制页面滚动位置
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const scrollGuard: RouteGuard = (to, from, next) => {
  // 安全地处理滚动行为
  setTimeout(() => {
    try {
      // 确保window对象存在且scrollTo方法可用
      if (typeof window !== 'undefined' && window && window.scrollTo) {
        // 如果路由有保存的滚动位置，则恢复
        if (to.meta?.savedPosition && typeof to.meta.savedPosition === 'object') {
          const { x = 0, y = 0 } = to.meta.savedPosition
          window.scrollTo(x, y)
        } else {
          // 否则滚动到顶部
          window.scrollTo(0, 0)
        }
      }
    } catch (error) {
      console.warn('Scroll guard error:', error)
      // 静默处理错误，不中断应用
    }
  }, 0)
  
  next()
}

/**
 * 缓存守卫 - 管理页面缓存
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const cacheGuard: RouteGuard = (to, from, next) => {
  // 这里可以实现页面缓存逻辑
  // 例如：根据路由meta信息决定是否缓存页面
  
  next()
}

/**
 * 数据预加载守卫 - 预加载页面所需数据
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const preloadGuard: RouteGuard = async (to, from, next) => {
  try {
    // 这里可以实现数据预加载逻辑
    // 例如：在进入页面前预加载必要的数据
    
    if (to.meta?.preload) {
      // 执行预加载操作
      await Promise.resolve() // 示例：替换为实际的预加载逻辑
    }
    
    next()
  } catch (error) {
    console.error('Preload error:', error)
    next() // 即使预加载失败也允许导航
  }
}

/**
 * 分析守卫 - 发送页面访问统计
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const analyticsGuard: RouteGuard = (to, from, next) => {
  // 这里可以实现页面访问统计
  // 例如：发送页面访问数据到分析平台
  
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: to.name,
      page_path: to.path
    })
  }
  
  next()
}

/**
 * 全局路由守卫组合
 * 按顺序执行所有守卫
 */
export const globalGuards: RouteGuard[] = [
  authGuard,
  roleGuard,
  titleGuard,
  scrollGuard,
  cacheGuard,
  preloadGuard,
  analyticsGuard
]

/**
 * 创建路由守卫中间件
 * @param guards 守卫数组
 * @returns 组合后的守卫函数
 */
export function createGuardMiddleware(guards: RouteGuard[]): RouteGuard {
  return async (to, from, next) => {
    for (const guard of guards) {
      try {
        await guard(to, from, next)
        
        // 如果守卫调用了next(false)，则停止执行后续守卫
        if (typeof next.called !== 'undefined' && next.called) {
          return
        }
      } catch (error) {
        console.error('Route guard error:', error)
        next(error)
        return
      }
    }
    
    // 所有守卫执行完毕，允许导航
    next()
  }
}

/**
 * 错误处理守卫
 * @param error 错误对象
 * @param to 目标路由
 * @param from 来源路由
 * @returns 错误处理结果
 */
export function errorHandler(
  error: any,
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): boolean {
  console.error('Navigation error:', error)
  
  // 根据错误类型处理不同的导航错误
  if (error.name === 'NavigationDuplicated') {
    // 忽略重复导航错误
    return true
  }
  
  if (error.status === 404) {
    // 处理404错误
    return false
  }
  
  // 其他错误可以在这里处理
  return false
}

/**
 * 路由守卫工具函数
 */

/**
 * 检查路由是否需要认证
 * @param route 路由对象
 * @returns 是否需要认证
 */
export function requiresAuth(route: RouteLocationNormalized): boolean {
  return route.matched.some(record => record.meta?.requiresAuth)
}

/**
 * 检查路由需要的角色权限
 * @param route 路由对象
 * @returns 需要的角色数组
 */
export function getRequiredRoles(route: RouteLocationNormalized): string[] {
  const roles = route.meta?.roles as string[]
  return roles || []
}

/**
 * 检查用户是否有权限访问路由
 * @param route 路由对象
 * @param userRole 用户角色
 * @returns 是否有权限
 */
export function hasPermission(
  route: RouteLocationNormalized,
  userRole: string
): boolean {
  const requiredRoles = getRequiredRoles(route)
  return requiredRoles.length === 0 || requiredRoles.includes(userRole)
}

export default {
  authGuard,
  roleGuard,
  titleGuard,
  scrollGuard,
  cacheGuard,
  preloadGuard,
  analyticsGuard,
  globalGuards,
  createGuardMiddleware,
  errorHandler,
  requiresAuth,
  getRequiredRoles,
  hasPermission
}