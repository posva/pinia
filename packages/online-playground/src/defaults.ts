import { InjectionKey, Ref } from 'vue'

export const AppVue = `
<script setup lang="ts">
import { useStore } from './counter'

const store = useStore()
</script>

<template>
  <button @click="store.n++">Increment {{ store.n }}</button>
</template>
`.trimStart()

export const counterTs = `
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('counter', () => {
  const n = ref(0)

  return { n }
})
`.trimStart()

export const PiniaVersionKey: InjectionKey<Ref<string>> =
  Symbol('pinia-version')
