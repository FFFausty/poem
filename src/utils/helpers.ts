/**
 * 通用工具函数库
 * 提供项目中常用的工具函数
 */

import type { DebounceOptions, ThrottleOptions } from '@/types'

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: any
  let result: any
  
  const { leading = false, trailing = true, maxWait } = options
  const maxWaitTime = maxWait ? Math.max(wait, maxWait) : undefined
  
  // 定时器函数
  const timerExpired = () => {
    const shouldCall = trailing && lastArgs !== null
    if (shouldCall) {
      result = func.apply(lastThis, lastArgs)
    }
    timeoutId = null
    lastArgs = null
  }
  
  // 主要函数
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const isLeading = leading && timeoutId === null
    
    lastThis = this
    lastArgs = args
    
    if (timeoutId === null) {
      if (isLeading) {
        result = func.apply(lastThis, lastArgs)
      }
      timeoutId = setTimeout(timerExpired, wait)
    }
    
    if (maxWaitTime !== undefined) {
      const timeSinceLastCall = now - (lastArgs ? now : 0)
      if (timeSinceLastCall >= maxWaitTime) {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        result = func.apply(lastThis, lastArgs)
        lastArgs = null
      }
    }
    
    return result
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: any
  let result: any
  let lastCallTime: number = 0
  
  const { leading = true, trailing = true } = options
  
  // 定时器函数
  const timerExpired = () => {
    lastCallTime = Date.now()
    timeoutId = null
    if (trailing && lastArgs !== null) {
      result = func.apply(lastThis, lastArgs)
      lastArgs = null
    }
  }
  
  // 主要函数
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (!lastCallTime && !leading) {
      lastCallTime = now
    }
    
    const remaining = wait - (now - lastCallTime)
    
    lastThis = this
    lastArgs = args
    
    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCallTime = now
      result = func.apply(lastThis, lastArgs)
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(timerExpired, remaining)
    }
    
    return result
  }
}

/**
 * 深拷贝函数
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD'
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成随机ID
 * @param length ID长度
 * @returns 随机ID字符串
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 数字格式化
 * @param num 要格式化的数字
 * @param decimals 小数位数
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number, decimals: number = 0): string {
  if (isNaN(num)) return '0'
  
  const fixedNum = num.toFixed(decimals)
  const parts = fixedNum.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 强度等级（0-4）
 */
export function checkPasswordStrength(password: string): number {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  return strength
}

/**
 * 获取URL参数
 * @param name 参数名
 * @returns 参数值
 */
export function getUrlParam(name: string): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

/**
 * 设置URL参数
 * @param params 参数对象
 */
export function setUrlParams(params: Record<string, string>): void {
  const urlParams = new URLSearchParams(window.location.search)
  
  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, value)
  })
  
  const newUrl = window.location.pathname + '?' + urlParams.toString()
  window.history.replaceState({}, '', newUrl)
}

/**
 * 移除URL参数
 * @param names 要移除的参数名数组
 */
export function removeUrlParams(names: string[]): void {
  const urlParams = new URLSearchParams(window.location.search)
  
  names.forEach(name => {
    urlParams.delete(name)
  })
  
  const newUrl = window.location.pathname + 
    (urlParams.toString() ? '?' + urlParams.toString() : '')
  window.history.replaceState({}, '', newUrl)
}

/**
 * 本地存储工具函数
 */

/**
 * 设置本地存储项
 * @param key 键名
 * @param value 值
 * @param expire 过期时间（毫秒）
 */
export function setStorage(key: string, value: any, expire?: number): void {
  try {
    const data = {
      value,
      expire: expire ? Date.now() + expire : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('LocalStorage set error:', error)
  }
}

/**
 * 获取本地存储项
 * @param key 键名
 * @returns 存储的值或null
 */
export function getStorage<T>(key: string): T | null {
  try {
    const dataStr = localStorage.getItem(key)
    if (!dataStr) return null
    
    const data = JSON.parse(dataStr)
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key)
      return null
    }
    
    return data.value
  } catch (error) {
    console.error('LocalStorage get error:', error)
    return null
  }
}

/**
 * 移除本地存储项
 * @param key 键名
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('LocalStorage remove error:', error)
  }
}

/**
 * 清空本地存储
 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('LocalStorage clear error:', error)
  }
}

/**
 * 性能监控工具
 */

/**
 * 测量函数执行时间
 * @param fn 要测量的函数
 * @param label 测量标签
 * @returns 函数执行结果
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string = 'Function'
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  console.log(`[Performance] ${label} took ${(end - start).toFixed(2)}ms`)
  return result
}

/**
 * 创建性能监控标记
 * @param name 标记名称
 */
export function performanceMark(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name)
  }
}

/**
 * 测量两个性能标记之间的时间
 * @param startMark 开始标记
 * @param endMark 结束标记
 * @returns 时间差（毫秒）
 */
export function measurePerformanceBetween(
  startMark: string,
  endMark: string
): number {
  if (typeof performance !== 'undefined' && performance.measure) {
    performance.measure('measure', startMark, endMark)
    const measures = performance.getEntriesByName('measure')
    if (measures.length > 0) {
      return measures[0].duration
    }
  }
  return 0
}

export default {
  debounce,
  throttle,
  deepClone,
  formatDate,
  generateId,
  formatNumber,
  formatFileSize,
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,
  getUrlParam,
  setUrlParams,
  removeUrlParams,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  measurePerformance,
  performanceMark,
  measurePerformanceBetween
}