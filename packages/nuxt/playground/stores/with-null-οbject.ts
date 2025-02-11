export const useWithNullObjectStore = defineStore('with-null-object', () => {
  return {
    text: ref(Object.create(null)),
    foo: ref('bar'),
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useWithNullObjectStore, import.meta.hot)
  )
}
