import { defineConfig, Plugin } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { promises as fs } from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), copyPiniaPlugin()],
  define: {
    __DEV__: 'true',
    // __BROWSER__: 'true',
    __TEST__: 'false',
  },
  resolve: {
    dedupe: ['vue', 'pinia'],
    alias: {
      // FIXME: use fileToUrl
      pinia: path.resolve(__dirname, '../pinia/src/index.ts'),
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
      const filePath = path.resolve(__dirname, '../pinia/dist/pinia.mjs')

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
