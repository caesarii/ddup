import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    ...(command === 'build'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg'],
            manifest: {
              name: '儿童学习工具',
              short_name: '学习工具',
              description: '面向儿童的学习类 PWA 工具',
              theme_color: '#4f46e5',
              background_color: '#ffffff',
              display: 'standalone',
              start_url: '/',
              icons: [
                {
                  src: '/favicon.svg',
                  sizes: 'any',
                  type: 'image/svg+xml',
                  purpose: 'any',
                },
              ],
            },
          }),
        ]
      : []),
  ],
}))
