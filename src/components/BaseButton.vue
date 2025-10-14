<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <span v-if="loading" class="button-loading">
      <svg class="loading-spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <span v-if="loadingText">{{ loadingText }}</span>
    </span>
    
    <!-- 图标 -->
    <span v-if="icon && !loading" class="button-icon">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
    
    <!-- 内容 -->
    <span v-if="$slots.default" class="button-content">
      <slot></slot>
    </span>
    
    <!-- 默认插槽内容 -->
    <span v-else-if="text" class="button-text">
      {{ text }}
    </span>
  </component>
</template>

<script setup lang="ts">
import type { ButtonType, ButtonSize } from '@/types'

/**
 * 按钮组件 Props 接口定义
 */
interface ButtonProps {
  // 基础属性
  type?: ButtonType
  size?: ButtonSize
  text?: string
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  
  // 样式属性
  outline?: boolean
  rounded?: boolean
  block?: boolean
  shadow?: boolean
  
  // 图标属性
  icon?: string
  iconPosition?: 'left' | 'right'
  
  // 可访问性
  ariaLabel?: string
  
  // 原生属性
  nativeType?: 'button' | 'submit' | 'reset'
  tag?: string | Component
}

/**
 * 按钮组件 Emits 定义
 */
interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
}

/**
 * 按钮组件 Props 默认值
 */
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  nativeType: 'button',
  tag: 'button',
  iconPosition: 'left',
  rounded: false,
  block: false,
  shadow: false,
  outline: false
})

const emit = defineEmits<ButtonEmits>()

/**
 * 按钮类名计算
 */
const buttonClasses = computed(() => {
  return [
    'base-button',
    `button-${props.type}`,
    `button-${props.size}`,
    {
      'button-outline': props.outline,
      'button-rounded': props.rounded,
      'button-block': props.block,
      'button-shadow': props.shadow,
      'button-disabled': props.disabled,
      'button-loading': props.loading,
      'button-icon-only': !props.text && !$slots.default && !!props.icon
    }
  ]
})

/**
 * 处理按钮点击事件
 */
const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

/**
 * 按钮类型对应的样式类映射
 */
const buttonTypeClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error'
}

/**
 * 按钮尺寸对应的样式类映射
 */
const buttonSizeClasses = {
  small: 'btn-small',
  medium: 'btn-medium',
  large: 'btn-large'
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  position: relative;
}

/* 按钮类型样式 */
.button-primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.button-primary:hover:not(.button-disabled) {
  background-color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.button-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.button-secondary:hover:not(.button-disabled) {
  background-color: var(--border-color);
}

.button-success {
  background-color: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.button-warning {
  background-color: var(--warning-color);
  color: white;
  border-color: var(--warning-color);
}

.button-error {
  background-color: var(--error-color);
  color: white;
  border-color: var(--error-color);
}

/* 按钮尺寸样式 */
.button-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.button-medium {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.button-large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* 按钮变体样式 */
.button-outline {
  background-color: transparent;
}

.button-outline.button-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.button-outline.button-primary:hover:not(.button-disabled) {
  background-color: var(--primary-color);
  color: white;
}

.button-rounded {
  border-radius: 9999px;
}

.button-block {
  display: flex;
  width: 100%;
}

.button-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-shadow:hover:not(.button-disabled) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 禁用状态 */
.button-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载状态 */
.button-loading {
  pointer-events: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

.loading-spinner .path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 图标样式 */
.button-icon {
  display: flex;
  align-items: center;
}

.button-icon-only {
  padding: 0.5rem;
}

.button-icon-only .button-icon {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .base-button {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
  
  .button-large {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>