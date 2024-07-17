import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    AutoImport({ imports: ['vue', 'vue-router', '@vueuse/core'], resolvers: [NaiveUiResolver()] }),
    Components({ resolvers: [NaiveUiResolver()] }),
    VitePWA({
      manifest: {
        name: 'Loan Calculator',
        short_name: 'loan-calculator',
        description: 'loan calculator',
        theme_color: '#ffffff'
      },
      devOptions: { enabled: true }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('echarts') || id.includes('zrender') || id.includes('vue-echarts')) {
              return 'echarts'
            } else if (id.includes('naive-ui')) {
              return 'naive-ui'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
