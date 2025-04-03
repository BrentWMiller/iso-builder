import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Bundle babel helpers to reduce bundle size
      babel: {
        babelrc: false,
        configFile: false,
        plugins: ['@babel/plugin-transform-react-jsx'],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Output smaller chunks for better caching
    chunkSizeWarningLimit: 600,
    // Minify the output
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.logs in production
        drop_console: true,
        // Optimize for performance
        passes: 2,
      },
    },
    // Use differential loading for better browser compatibility and performance
    target: 'es2015',
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
          store: ['zustand', 'immer'],
        },
      },
    },
  },
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  // Optimize dependencies during dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', 'zustand', 'immer'],
  },
  // Improve dev server performance
  server: {
    hmr: {
      overlay: true,
    },
  },
  esbuild: {
    // Minify class names for smaller bundles
    keepNames: false,
    // Tree-shaking for better dead code elimination
    treeShaking: true,
  },
});
