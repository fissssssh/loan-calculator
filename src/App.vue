<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { WeatherSunny24Regular, WeatherMoon24Filled } from '@vicons/fluent'
const theme = ref()
const isDark = useDark({
  onChanged(dark: boolean) {
    if (dark) {
      theme.value = darkTheme
    } else {
      theme.value = undefined
    }
  }
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <n-config-provider :theme="theme">
    <n-layout content-style="height:100vh;">
      <header class="container h-16 px-4 mx-auto flex justify-between items-center">
        <div class="text-xl">贷款计算器</div>
        <div>
          <n-button circle @click="toggleDark()" type="primary" :ghost="!isDark">
            <n-icon
              :size="24"
              :component="isDark ? WeatherSunny24Regular : WeatherMoon24Filled"></n-icon>
          </n-button>
        </div>
      </header>
      <main class="mx-auto container px-4">
        <router-view></router-view>
      </main>
    </n-layout>
  </n-config-provider>
</template>

<style scoped></style>
