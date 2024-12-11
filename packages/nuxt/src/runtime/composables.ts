import { useNuxtApp } from '#app'
import {
  defineStore as _defineStore,
  type Pinia,
  type StoreGeneric,
} from 'pinia'
export * from 'pinia'

export const usePinia = () => useNuxtApp().$pinia

export const defineStore = (...args) => {
  if (!import.meta.server) {
    return _defineStore(...args)
  }

  const store = _defineStore(...args)

  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
    if (pinia) {
      return store(pinia, hot)
    }

    return store(usePinia(), hot)
  }

  return useStore
}
