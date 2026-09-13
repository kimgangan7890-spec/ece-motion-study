import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// GitHub Pages는 https://<id>.github.io/<repo>/ 하위경로로 서비스되므로
// 프로덕션 빌드에서만 base를 레포 이름으로 설정한다. (dev는 '/' 유지)
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/ece-motion-study/' : '/',
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
}));
