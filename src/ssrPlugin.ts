import { VueConstructor } from 'vue/types'
import { setActiveReq } from './rootStore'

export const PiniaSsr = (vue: VueConstructor) => {
  const isServer = typeof window === 'undefined'

  if (!isServer) {
    console.warn(
      '`PiniaSsrPlugin` seems to be used in the browser bundle. You should only call it on the server entry: https://github.com/posva/pinia#raw-vue-ssr'
    )
    return
  }

  vue.mixin({
    beforeCreate() {
      const { setup, serverPrefetch } = this.$options
      if (setup) {
        this.$options.setup = (props, context) => {
          // @ts-ignore
          setActiveReq(context.ssrContext.req)
          return setup(props, context)
        }
      }

      if (serverPrefetch) {
        const patchedServerPrefetch = Array.isArray(serverPrefetch)
          ? serverPrefetch.slice()
          : // serverPrefetch not being an array cannot be triggered due tue options merge
            // https://github.com/vuejs/vue/blob/7912f75c5eb09e0aef3e4bfd8a3bb78cad7540d7/src/core/util/options.js#L149
            /* istanbul ignore next */
            [serverPrefetch]

        for (let i = 0; i < patchedServerPrefetch.length; i++) {
          const original = patchedServerPrefetch[i]
          patchedServerPrefetch[i] = function() {
            // @ts-ignore
            setActiveReq(this.$ssrContext.req)

            return original.call(this)
          }
        }

        // @ts-ignore
        this.$options.serverPrefetch = patchedServerPrefetch
      }
    },
  })
}
