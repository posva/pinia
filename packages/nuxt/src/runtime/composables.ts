import { useNuxtApp } from '#app'
import type { Pinia } from 'pinia'
export * from 'pinia'

export const usePinia = () => useNuxtApp().$pinia as Pinia
