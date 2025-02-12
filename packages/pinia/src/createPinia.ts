import { Pinia, PiniaPlugin, setActivePinia, piniaSymbol } from './rootStore'
import { ref, App, markRaw, effectScope, Ref } from 'vue'
import { registerPiniaDevtools, devtoolsPlugin } from './devtools'
import { IS_CLIENT } from './env'
import { StateTree, StoreGeneric } from './types'

/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  const scope = effectScope(true)
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!

  let _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia)
  let toBeInstalled: PiniaPlugin[] = []

  const pinia: Pinia = markRaw({
    install(app: App) {
      // this allows calling useStore() outside of a component setup after
      // installing pinia's plugin
      setActivePinia(pinia)
      pinia._a = app
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
      /* istanbul ignore else */
      if (__USE_DEVTOOLS__ && IS_CLIENT) {
        registerPiniaDevtools(app, pinia)
      }
      toBeInstalled.forEach((plugin) => _p.push(plugin))
      toBeInstalled = []
    },

    use(plugin) {
      if (!this._a) {
        toBeInstalled.push(plugin)
      } else {
        _p.push(plugin)
      }
      return this
    },

    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: new Map<string, StoreGeneric>(),
    state,
  })

  // pinia devtools rely on dev only features so they cannot be forced unless
  // the dev build of Vue is used. Avoid old browsers like IE11.
  if (__USE_DEVTOOLS__ && IS_CLIENT && typeof Proxy !== 'undefined') {
    pinia.use(devtoolsPlugin)
  }

  return pinia
}

/**
 * Dispose a Pinia instance by stopping its effectScope and removing the state, plugins and stores. This is mostly
 * useful in tests, with both a testing pinia or a regular pinia and in applications that use multiple pinia instances.
 * Once disposed, the pinia instance cannot be used anymore.
 *
 * @param pinia - pinia instance
 */
export function disposePinia(pinia: Pinia) {
  pinia._e.stop()
  pinia._s.clear()
  pinia._p.splice(0)
  pinia.state.value = {}
  // @ts-expect-error: non valid
  pinia._a = null
}
