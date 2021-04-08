export {
  setActivePinia,
  createPinia,
  Pinia,
  PiniaStorePlugin,
} from './rootStore'
export { defineStore } from './store'
export { PiniaPlugin } from './plugin'
export {
  StateTree,
  Store,
  StoreWithGetters,
  StoreWithActions,
  StoreWithState,
  PiniaCustomProperties,
} from './types'

export {
  mapActions,
  mapStores,
  mapState,
  mapGetters,
  MapStoresCustomization,
  setMapStoreSuffix,
} from './mapHelpers'

// TODO: remove in beta
export { createStore } from './deprecated'
