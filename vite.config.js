// vite.config.js - Nuclear option
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env': '{}',
    'process.platform': '"browser"'
  },
  ssr: {
    // Also fix SSR issues if any
    noExternal: true,
    target: 'webworker'
  }
});