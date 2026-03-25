import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = (env.VITE_API_BASE_URL || '').trim()
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: apiBaseUrl
      ? undefined
      : {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true
            },
            '/swagger': {
              target: proxyTarget,
              changeOrigin: true
            }
          }
        }
  }
})
