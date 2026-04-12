import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // macOS 에서 chokidar 의 FSEvents watcher 가 가끔 변경을 놓쳐서
    // 새 코드가 반영되지 않는 문제가 반복 발생함 → polling 으로 우회.
    // CPU 사용은 조금 늘지만 dev 안정성이 훨씬 좋아짐.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
