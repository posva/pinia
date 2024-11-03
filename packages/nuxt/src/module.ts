/**
 * @module @pinia/nuxt
 */
import {
  defineNuxtModule,
  addPlugin,
  isNuxtMajorVersion,
  addImports,
  createResolver,
  addImportsDir,
} from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'
import { fileURLToPath } from 'node:url'

export interface ModuleOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex (Nuxt 2 only)
   *
   * @default `true`
   */
  disableVuex?: boolean

  /**
   * Automatically add stores dirs to the auto imports. This is the same as
   * directly adding the dirs to the `imports.dirs` option. If you want to
   * also import nested stores, you can use the glob pattern `./stores/**`
   *
   * @default `['stores']`
   */
  storesDirs?: string[]
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pinia',
    configKey: 'pinia',
    compatibility: {
      nuxt: '^2.0.0 || >=3.13.0',
      bridge: true,
    },
  },
  defaults: {
    disableVuex: true,
  },
  setup(options, nuxt) {
    // configure transpilation
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Disable default Vuex store (Nuxt v2.10+ only)
    if (
      nuxt.options.features &&
      // ts
      options.disableVuex &&
      isNuxtMajorVersion(2, nuxt)
    ) {
      // @ts-expect-error: no `store` feature flag in nuxt v3
      nuxt.options.features.store = false
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve(runtimeDir))

    // avoids having multiple copies of pinia
    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.exclude ??= []
    if (!nuxt.options.vite.optimizeDeps.exclude.includes('pinia')) {
      nuxt.options.vite.optimizeDeps.exclude.push('pinia')
    }

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: '@pinia/nuxt' })
    })

    // Add runtime plugin before the router plugin
    // https://github.com/nuxt/framework/issues/9130
    nuxt.hook('modules:done', () => {
      if (isNuxtMajorVersion(2, nuxt)) {
        addPlugin(resolve(runtimeDir, 'plugin.vue2'))
      } else {
        addPlugin(resolve(runtimeDir, 'plugin.vue3'))
        addPlugin(resolve(runtimeDir, 'payload-plugin'))
      }
    })

    // Add auto imports
    const composables = resolve(runtimeDir, 'composables')
    addImports([
      { from: composables, name: 'defineStore' },
      { from: composables, name: 'acceptHMRUpdate' },
      { from: composables, name: 'usePinia' },
      { from: composables, name: 'storeToRefs' },
    ])

    if (!options.storesDirs) {
      // resolve it against the src dir which is the root by default
      options.storesDirs = [resolve(nuxt.options.srcDir, 'stores')]
    }

    if (options.storesDirs) {
      for (const storeDir of options.storesDirs) {
        addImportsDir(resolve(nuxt.options.rootDir, storeDir))
      }
    }
  },
})

export default module
