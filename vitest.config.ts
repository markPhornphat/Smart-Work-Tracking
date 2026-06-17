import vitestConfig from 'vitest/config';

export default vitestConfig.defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/index.ts', 'src/shared/interface/types.ts']
    },
    alias: {
      '@': '/src'
    }
  }
});