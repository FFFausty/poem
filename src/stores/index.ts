/**
 * 状态管理模块统一导出
 * 提供所有 Store 的集中管理和类型导出
 */

export { useUserStore } from './user'
export { usePoemStore } from './poem'

export type { UserStore } from './user'
export type { PoemStore } from './poem'

/**
 * Store 初始化函数
 * 用于在应用启动时初始化所有 Store
 */
export const initializeStores = (): void => {
  // 这里可以添加全局的 Store 初始化逻辑
  // 例如：从本地存储恢复状态、设置全局监听等
  
  console.log('Stores initialized')
}

/**
 * Store 清理函数
 * 用于在应用关闭时清理所有 Store 状态
 */
export const cleanupStores = (): void => {
  // 这里可以添加全局的 Store 清理逻辑
  // 例如：清除定时器、取消网络请求等
  
  console.log('Stores cleaned up')
}

/**
 * Store 工具函数
 */

/**
 * 重置所有 Store 状态
 * 用于测试或用户退出时清理状态
 */
export const resetAllStores = (): void => {
  // 获取所有 Store 实例并调用重置方法
  // 注意：这需要每个 Store 都实现 reset 方法
  
  console.warn('Resetting all stores - this should only be used in development or testing')
}

/**
 * Store 状态持久化配置
 */
export const storePersistenceConfig = {
  // 需要持久化的 Store 名称
  persistedStores: ['user', 'settings'],
  
  // 持久化存储键名前缀
  storageKeyPrefix: 'poem_app_',
  
  // 存储引擎（localStorage/sessionStorage）
  storageEngine: 'localStorage' as 'localStorage' | 'sessionStorage',
  
  // 序列化配置
  serialize: (value: any) => JSON.stringify(value),
  deserialize: (value: string) => JSON.parse(value)
}

/**
 * Store 中间件配置
 * 用于添加全局的 Store 中间件功能
 */
export const storeMiddleware = {
  // 日志中间件
  logger: (store: any) => {
    store.$subscribe((mutation: any, state: any) => {
      console.log(`[Store Mutation] ${mutation.type}`, mutation.payload)
      console.log('[Store State]', state)
    })
  },
  
  // 持久化中间件
  persistence: (store: any) => {
    // 自动保存到本地存储的逻辑
    // 这里可以实现自动的 Store 状态持久化
  },
  
  // 错误处理中间件
  errorHandler: (store: any) => {
    // 全局错误处理逻辑
    // 这里可以捕获 Store 操作中的错误并进行统一处理
  }
}

/**
 * Store 类型工具
 */

/**
 * 获取 Store 状态类型
 */
export type StoreState<T> = T extends { $state: infer S } ? S : never

/**
 * 获取 Store 方法类型
 */
export type StoreActions<T> = Omit<T, keyof { $state: any }>

/**
 * Store 组合函数
 * 用于创建复杂的 Store 组合逻辑
 */

/**
 * 创建带缓存的 Store
 */
export const createCachedStore = <T>(storeFactory: () => T, cacheKey: string) => {
  let cachedStore: T | null = null
  
  return () => {
    if (!cachedStore) {
      cachedStore = storeFactory()
    }
    return cachedStore
  }
}

/**
 * 创建带依赖的 Store
 */
export const createDependentStore = <T, D>(
  storeFactory: (deps: D) => T,
  dependencies: D
) => {
  return storeFactory(dependencies)
}

/**
 * Store 性能监控
 */
export const storePerformance = {
  // 记录 Store 操作耗时
  measureOperation: (operationName: string, operation: () => void) => {
    const startTime = performance.now()
    operation()
    const endTime = performance.now()
    console.log(`[Store Performance] ${operationName} took ${endTime - startTime}ms`)
  },
  
  // 监控 Store 内存使用
  monitorMemory: () => {
    // 这里可以实现 Store 内存使用监控
  }
}

export default {
  initializeStores,
  cleanupStores,
  resetAllStores,
  storePersistenceConfig,
  storeMiddleware,
  storePerformance
}