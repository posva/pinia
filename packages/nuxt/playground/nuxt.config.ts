import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import piniaModule from '../src/module'

export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    pinia: fileURLToPath(new URL('../../pinia/src/index.ts', import.meta.url)),
  },

  modules: [piniaModule],

  telemetry: {
    enabled: false,
  },

  pinia: {
    storesDirs: ['./stores/**', './domain/*/stores'],
  },

  vite: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __USE_DEVTOOLS__: true,
      __TEST__: false,
    },
  },

  compatibilityDate: '2024-09-26',
})
