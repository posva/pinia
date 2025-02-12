import { defineStore, acceptHMRUpdate } from 'pinia'
import { onScopeDispose, ref } from 'vue'

export const useScroll = defineStore('scroll', () => {
  const scrollTop = ref(window.scrollY)

  function onScroll() {
    scrollTop.value = window.scrollY
  }

  function trackScroll() {
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  trackScroll()

  function $cleanUp() {
    console.log('Cleaning up old scroll event listeners')
    window.removeEventListener('scroll', onScroll)
  }

  // if someone wants the scroll tracking only to happen on a certain route,
  // one can dispose the store before leaving the route.
  onScopeDispose(() => {
    console.log('onScopeDispose')
    $cleanUp()
  })

  return {
    scrollTop,
    trackScroll,
    $cleanUp,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useScroll, import.meta.hot, (existingStore) => {
      console.log('HMR update')
      existingStore.$cleanUp()
    })
  )
}
