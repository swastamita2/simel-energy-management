import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vitest.config.ts';

// Kita ambil config utama (viteConfig) tapi kita TUNDA/OVERRIDE bagian 'test'
export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Override include untuk HANYA menjalankan file integration test
    include: ['src/tests/integration/**/*.test.ts'],
    // Override exclude untuk memastikan file ini tidak di-exclude
    exclude: ['node_modules/**'],
  }
}));
