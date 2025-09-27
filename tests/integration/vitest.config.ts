import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/integration/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
  },
  esbuild: {
    target: 'node18',
  },
})