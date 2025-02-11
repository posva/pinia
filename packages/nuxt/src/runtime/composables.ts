import { useNuxtApp } from '#app'
import {
  defineStore as _defineStore,
  type Pinia,
  type StoreGeneric,
} from 'pinia'
export * from 'pinia'

export const usePinia = () => useNuxtApp().$pinia as Pinia | undefined

export const defineStore: typeof _defineStore = (
  ...args: [idOrOptions: any, setup?: any, setupOptions?: any]
) => {
  if (!import.meta.server) {
    return _defineStore(...args)
  }

  const originalUseStore = _defineStore(...args)
  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
    return originalUseStore(pinia || usePinia(), hot)
  }

  useStore.$id = originalUseStore.$id
  useStore._pinia = originalUseStore._pinia

  return useStore
}
