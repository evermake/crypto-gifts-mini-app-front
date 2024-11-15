import path from 'node:path'
import vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: [
          `@use "~/assets/css/typography" as t;`,
        ].join('\n'),
      },
    },
  },
})
