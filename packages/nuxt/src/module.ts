/**
 * @module @pinia/nuxt
 */
import { addPlugin, defineNuxtModule } from '@nuxt/kit'
import { isVue2 } from 'vue-demi'
import type { Pinia } from 'pinia'
import type { Context } from '@nuxt/types'

export interface PiniaNuxtOptions {
  /**
   * Pinia disables Vuex by default, set this option to `false` to avoid it and
   * use Pinia alongside Vuex.
   *
   * @default `true`
   */
  disableVuex?: boolean
}

const module = defineNuxtModule<PiniaNuxtOptions>({
  name: 'pinia',
  configKey: 'pinia',
  defaults: {
    disableVuex: true,
  },
  setup(options, nuxt) {
    // Disable default Vuex store (options.features only exists in Nuxt v2.10+)
    if (nuxt.options.features && options.disableVuex) {
      nuxt.options.features.store = false
    }

    addPlugin({ src: require.resolve('./plugin.mjs') })

    // transpile pinia for nuxt 2 and nuxt bridge
    if (isVue2 && !nuxt.options.build.transpile.includes('pinia')) {
      nuxt.options.build.transpile.push('pinia')
    }
  },
})

export default module

declare module '@nuxt/types' {
  export interface Context {
    /**
     * Pinia instance attached to the app.
     *
     * @deprecated: use context.$pinia instead
     */
    pinia: Pinia

    /**
     * Pinia instance attached to the app.
     */
    $pinia: Pinia
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    /**
     * Nuxt context.
     */
    $nuxt: Context
  }
}
