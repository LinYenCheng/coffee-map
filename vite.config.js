import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/coffee-map/',
  define: {
    'process.env': process.env,
  },
  server: {
    port: 3000,
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    // loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', ['lcov', { projectRoot: './src' }, 'json-summary']],
      include: ['src/**/*'],
      exclude: [],
    },
  },
});
