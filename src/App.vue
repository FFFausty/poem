<template>
  <div id="app">
    <RouterView />
    <FloatingAssistant />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import FloatingAssistant from './components/FloatingAssistant.vue'
</script>

<style>
#app {
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>