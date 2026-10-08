import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 3 trang: / = v2 · /v3.html = v3 (mới nhất) · /v1.html = v1
  build: { rollupOptions: { input: { main: 'index.html', v1: 'v1.html', v3: 'v3.html' } } },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 còn dùng @import → tắt cảnh báo cho đỡ rối terminal
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
});
