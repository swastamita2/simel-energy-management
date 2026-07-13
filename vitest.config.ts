import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Gunakan jsdom agar localStorage, window, dan DOM API tersedia
    environment: 'jsdom',
    // File setup global sebelum setiap test suite berjalan
    setupFiles: ['./src/test/setup.ts'],
    // Pola file yang dikenali sebagai default test run (Unit & Component)
    include: ['src/tests/unit/**/*.test.ts', 'src/**/*.test.tsx', 'src/lib/**/*.test.ts'],
    // Hapus exclude untuk integration test, agar bisa dijalankan secara eksplisit via argumen CLI
    exclude: ['node_modules/**'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/services/**/*.ts', 'src/lib/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.integration.test.ts', 'src/test/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
