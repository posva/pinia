import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    __USE_DEVTOOLS__: false,
  },
  resolve: {
    alias: [
      {
        find: /^@pinia\/(.*?)$/,
        replacement: fileURLToPath(
          new URL('./packages/packages/$1/src', import.meta.url)
        ),
      },
      {
        find: /^pinia$/,
        replacement: fileURLToPath(
          new URL('./packages/pinia/src', import.meta.url)
        ),
      },
    ],
  },

  test: {
    include: ['src/**/*.{test,spec}.ts', '__tests__/**/*.{test,spec}.ts'],
    setupFiles: [
      fileURLToPath(
        new URL('./packages/pinia/__tests__/vitest-setup.ts', import.meta.url)
      ),
    ],
    environment: 'happy-dom',
    fakeTimers: {
      // easier to read, some date in 2001
      now: 1_000_000_000_000,
    },
    typecheck: {
      enabled: true,
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcovonly', 'html'],
      all: true,
      include: [
        'packages/pinia/src',
        'packages/nuxt/src',
        'packages/testing/src',
      ],
      exclude: [
        '**/src/index.ts',
        '**/*.test-d.ts',
        'packages/pinia/src/devtools',
        'packages/pinia/src/vue2-plugin.ts',
        'packages/pinia/src/hmr.ts',
      ],
    },
  },
})
