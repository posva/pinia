import { defineConfig, Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import fs from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'
import VueDevtools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), copyPiniaPlugin(), VueDevtools()],
  define: {
    __DEV__: 'true',
    // __BROWSER__: 'true',
    __TEST__: 'false',
  },
  resolve: {
    dedupe: ['vue', 'pinia'],
    alias: {
      pinia: fileURLToPath(new URL('../pinia/src/index.ts', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@vueuse/shared', '@vueuse/core', 'pinia'],
  },
})

function copyPiniaPlugin(): Plugin {
  return {
    name: 'copy-pinia',
    async generateBundle() {
      const filePath = fileURLToPath(
        new URL('../pinia/dist/pinia.mjs', import.meta.url)
      )

      // throws if file doesn't exist
      await fs.access(filePath)

      this.emitFile({
        type: 'asset',
        fileName: 'pinia.mjs',
        source: await fs.readFile(filePath, 'utf-8'),
      })
    },
  }
}
