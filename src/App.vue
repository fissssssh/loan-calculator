<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import WeatherSunny24Regular from '@vicons/fluent/WeatherSunny24Regular'
import WeatherMoon24Filled from '@vicons/fluent/WeatherMoon24Filled'
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
    <n-layout class="h-screen">
      <n-layout-header bordered>
        <div class="container h-16 px-4 mx-auto flex justify-between items-center">
          <div class="text-xl">贷款计算器</div>
          <div>
            <n-button circle @click="toggleDark()" type="primary" :ghost="!isDark">
              <n-icon
                :size="24"
                :component="isDark ? WeatherSunny24Regular : WeatherMoon24Filled"></n-icon>
            </n-button>
          </div>
        </div>
      </n-layout-header>
      <n-layout-content class="mx-auto container p-4">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>
