import { describe, it, expect } from 'vitest'
import { reactive, ref } from 'vue'
import { createPinia, defineStore, Pinia, setActivePinia } from '../src'

describe('store.$patch', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore('main', {
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
        list: [] as number[],
      }),
    })()
  }

  const useArrayStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore('main', {
      state: () => ({
        items: [{ id: 0 }],
        currentItem: { id: 1 },
      }),
    })()
  }

  it('patches a property without touching the rest', () => {
    const store = useStore()
    store.$patch({ a: false })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
      list: [],
    })

    expect(store.a).toBe(false)
  })

  it('replaces whole arrays', () => {
    const store = useStore()
    store.$patch({ list: [1, 2] })
    expect(store.$state.list).toEqual([1, 2])
    expect(store.list).toEqual([1, 2])
  })

  it('can patch an item that has been copied to an array', () => {
    const store = useArrayStore()
    store.$state.currentItem = { id: 2 }
    // NOTE: a patch of an object is always recursive, writing in the object, in
    // place.
    //store.$patch({ currentItem: { id: 2 } })
    store.items.push(store.currentItem)
    // store.$patch({ currentItem: { id: 3 } })
    store.$state.currentItem = { id: 3 }

    expect(store.$state.items).toEqual([{ id: 0 }, { id: 2 }])
    expect(store.items).toEqual([{ id: 0 }, { id: 2 }])
  })

  it('replaces whole nested arrays', () => {
    const store = useStore()
    // @ts-expect-error: new state
    store.$patch({ nested: { list: [1, 2] } })
    expect(store.$state.nested).toEqual({
      foo: 'foo',
      a: { b: 'string' },
      list: [1, 2],
    })
    // @ts-expect-error: new state
    store.$patch({ nested: { list: [] } })
    expect(store.$state.nested).toEqual({
      foo: 'foo',
      a: { b: 'string' },
      list: [],
    })
  })

  it('patches using a function', () => {
    const store = useStore()
    store.$patch((state) => {
      expect(state).toBe(store.$state)
      state.a = !state.a
      state.list.push(1)
    })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
      list: [1],
    })
  })

  it('patches a nested property without touching the rest', () => {
    const store = useStore()
    store.$patch({ nested: { foo: 'bar' } })
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
      list: [],
    })
    store.$patch({ nested: { a: { b: 'hello' } } })
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'hello' },
      },
      list: [],
    })
  })

  it('patches multiple properties at the same time', () => {
    const store = useStore()
    store.$patch({ a: false, nested: { foo: 'hello' } })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'hello',
        a: { b: 'string' },
      },
      list: [],
    })
  })

  describe('skipping nested objects', () => {
    const useStore = (pinia?: Pinia) => {
      // create a new store
      setActivePinia(pinia || createPinia())
      return defineStore('main', {
        state: () => ({
          arr: [] as any[],
          name: 'Eduardo',
          item: { a: 0, b: 0 } as null | { a: number; b?: number },
        }),
      })()
    }
    // const useStore = (pinia?: Pinia) => {
    //   // create a new store
    //   setActivePinia(pinia || createPinia())
    //   return defineStore('main', () => {
    //     const arr = ref([] as any[])
    //     const item = ref({ a: 0, b: 0 } as null | { a: number; b?: number })

    //     return { arr, item }
    //   })()
    // }

    it('ref of primitive', () => {
      const pinia = createPinia()
      const store = useStore(pinia)
      const name = ref('Edu')
      // @ts-expect-error: because it's a ref
      store.$patch({ name })
      expect(pinia.state.value.main.name).toEqual('Edu')
      expect(store.$state.name).toEqual('Edu')
      expect(store.name).toEqual('Edu')
    })

    it('ref of object', () => {
      const pinia = createPinia()
      const store = useStore(pinia)
      const item = ref({ a: 1, b: 1 })
      const oldItem = store.item
      // @ts-expect-error: because it's a ref
      store.$state.item = item
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(pinia.state.value.main.item).toEqual({ a: 1, b: 1 })
      expect(store.$state.item).toEqual({ a: 1, b: 1 })
      expect(store.item).toEqual({ a: 1, b: 1 })

      // @ts-expect-error: because it's a ref
      store.$patch({ item: ref({ a: 2, b: 2 }) })
      expect(pinia.state.value.main.item).toEqual({ a: 2, b: 2 })
      expect(store.$state.item).toEqual({ a: 2, b: 2 })
      expect(store.item).toEqual({ a: 2, b: 2 })
    })

    it('nested ref', () => {
      const store = useStore()
      const item = ref({ nested: { a: 1, b: 1 } })
      const oldItem = store.item
      store.$patch({ item: item.value.nested })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })

    it('reactive', () => {
      const store = useStore()
      const item = reactive({ a: 1, b: 1 })
      const oldItem = store.item
      store.$patch({ item })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })

    it('from store', () => {
      const store = useStore()
      store.arr.push({ a: 1, b: 1 })
      const oldItem = store.item
      store.$patch({ item: store.arr[0] })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })
  })
})
