import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'pinia',
      root: './packages/pinia',
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@pinia/nuxt',
      root: './packages/nuxt',
      environment: 'node',
      include: ['test/**/*.{spec,test}.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: '@pinia/testing',
      root: './packages/testing',
      globals: true,
    },
  },
])
