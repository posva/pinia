# Create Store Dynamically

Store can be created dynamically using factory pattern. Which will greatly help reduce boilerplate and structure your application.

## Example

An usecase of multiple tables that require pagination and filter. And all need to have separate stores to keep track of the result and pagings.

We can have a creator function like this

```js
export const createPagingStore = (initialCurrentPage?: number) => {
  const currentPage = ref(initialCurrentPage ?? 0)
  const totalPage = ref(0)

  return { currentPage, totalPage }
}
```

Inside the `defineStore` option function you will have access to all the state and actions, and extra logic as needed.

```js

export const usePagingWeather = defineStore('pagingWeather, () => {
  const pagingStore = createPagingStore(1)
  const content = ref()

  // Logics for this store

  const fetchData = async (page) => {
    const data = await api.get(`https://example.com/?page=${page}`)
    currentPage.value = page
    totalPage.value = data.totalPage
    content.value = data.content
  }

  const sundays = computed(() => {
    return pagingStore.content.value.days.filter(day === 'sunday')
  })

  return {
    ...pagingStore, // currentPage, totalPage
    fetchData,
    content,

    sundays,
  }
})
```

Don't worry about the same `ref`'s inside multiple store to be the same. They are handled by `pinia` as separate states in the stores.
