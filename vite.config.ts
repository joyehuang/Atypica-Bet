import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
      },
      // 显式指定入口文件
      optimizeDeps: {
        include: ['react', 'react-dom']
      },
      // 明确指定入口文件为main.jsx
      root: __dirname,
      // 明确指定主入口文件
      appType: 'spa',
      // 配置服务器
      server: {
        port: 3000,
        host: '0.0.0.0',
        fs: {
          strict: false
        },
        proxy: {
          '/api/polymarket': {
            target: 'https://gamma-api.polymarket.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/polymarket/, ''),
            secure: true,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          },
          '/api/markets': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      }
    };
});
