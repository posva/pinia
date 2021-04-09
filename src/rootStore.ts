import { App, InjectionKey, Plugin, Ref, ref, warn } from 'vue'
import { IS_CLIENT } from './env'
import {
  StateTree,
  StoreWithState,
  StateDescriptor,
  PiniaCustomProperties,
  GenericStore,
} from './types'

/**
 * setActivePinia must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
export let activePinia: Pinia | undefined

/**
 * Sets or unsets the active pinia. Used in SSR and internally when calling
 * actions and getters
 *
 * @param pinia - Pinia instance
 */
export const setActivePinia = (pinia: Pinia | undefined) =>
  (activePinia = pinia)

/**
 * Get the currently active pinia
 */
export const getActivePinia = () => {
  if (__DEV__ && !activePinia) {
    warn(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n\n` +
        `const pinia = createPinia()\n` +
        `app.use(pinia)\n\n` +
        `This will fail in production.`
    )
  }

  return activePinia!
}

/**
 * Map of stores based on a Pinia instance. Allows setting and retrieving stores
 * for the current running application (with its pinia).
 */

export const storesMap = new WeakMap<
  Pinia,
  Map<string, [StoreWithState<string, StateTree>, StateDescriptor<StateTree>]>
>()

/**
 * Client-side application instance used for devtools
 */
export let clientApp: App | undefined /*#__PURE__*/
export const setClientApp = (app: App) => (clientApp = app)
export const getClientApp = () => clientApp

/**
 * Plugin to extend every store
 */
export interface PiniaStorePlugin {
  (app: App): Partial<PiniaCustomProperties>
}

/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  install: Exclude<Plugin['install'], undefined>

  /**
   * root state
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaStorePlugin): void

  /**
   * Installed store plugins
   *
   * @internal
   */
  _p: Array<() => Partial<PiniaCustomProperties>>
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Access to the application's Pinia
     */
    $pinia: Pinia

    /**
     * Cache of stores instantiated by the current instance. Used by map
     * helpers.
     */
    _pStores?: Record<string, GenericStore>
  }
}

export const piniaSymbol = (__DEV__
  ? Symbol('pinia')
  : /* istanbul ignore next */
    Symbol()) as InjectionKey<Pinia>

/**
 * Creates a Pinia instance to be used by the application
 */
export function createPinia(): Pinia {
  // NOTE: here we could check the window object for a state and directly set it
  // if there is anything like it with Vue 3 SSR
  const state = ref({})

  let localApp: App | undefined
  let _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia)
  const toBeInstalled: PiniaStorePlugin[] = []

  const pinia: Pinia = {
    install(app: App) {
      localApp = app
      // pinia._a = app
      app.provide(piniaSymbol, pinia)
      app.config.globalProperties.$pinia = pinia
      // TODO: write test
      // only set the app on client for devtools
      if (__BROWSER__ && IS_CLIENT) {
        setClientApp(app)
        // this allows calling useStore() outside of a component setup after
        // installing pinia's plugin
        setActivePinia(pinia)
      }
      toBeInstalled.forEach((plugin) => _p.push(plugin.bind(null, localApp!)))
    },

    use(plugin) {
      /* istanbul ignore next */
      if (__DEV__ && !__TEST__) {
        console.warn(
          `[🍍]: The plugin API has plans to change to bring better extensibility. "pinia.use()" signature will change in the next release. It is recommended to avoid using this API.`
        )
      }
      if (!localApp) {
        toBeInstalled.push(plugin)
      } else {
        _p.push(plugin.bind(null, localApp))
      }
    },

    _p,

    state,
  }

  return pinia
}
