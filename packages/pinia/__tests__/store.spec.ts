import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { defineComponent, getCurrentInstance, nextTick, watch } from 'vue'
import { mockWarn } from './vitest-mock-warn'

describe('Store', () => {
  mockWarn()

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }),
  })

  it('reuses a store', () => {
    const useStore = defineStore('main', {})
    expect(useStore()).toBe(useStore())
  })

  it('works with id as first argument', () => {
    const useStore = defineStore('main', {
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })
    expect(useStore()).toBe(useStore())
    const useStoreEmpty = defineStore('main', {})
    expect(useStoreEmpty()).toBe(useStoreEmpty())
  })

  it('sets the initial state', () => {
    const store = useStore()
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('works without setting the active pinia', async () => {
    setActivePinia(undefined)
    const pinia = createPinia()
    const useStore = defineStore('main', {
      state: () => ({ n: 0 }),
    })
    const TestComponent = defineComponent({
      template: `<div>{{ store. n }}</div>`,
      setup() {
        const store = useStore()
        return { store }
      },
    })
    const w1 = mount(TestComponent, { global: { plugins: [pinia] } })
    const w2 = mount(TestComponent, { global: { plugins: [pinia] } })
    expect(w1.text()).toBe('0')
    expect(w2.text()).toBe('0')

    w1.vm.store.n++
    await w1.vm.$nextTick()
    expect(w1.text()).toBe('1')
    expect(w2.text()).toBe('1')
  })

  it('can be reset', () => {
    const store = useStore()
    store.$state.a = false
    const spy = vi.fn()
    store.$subscribe(spy, { flush: 'sync' })
    expect(spy).not.toHaveBeenCalled()
    store.$reset()
    expect(spy).toHaveBeenCalledTimes(1)
    store.$state.nested.foo = 'bar'
    expect(spy).toHaveBeenCalledTimes(2)
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })

    expect(store.nested.foo).toBe('bar')
  })

  it('can create an empty state if no state option is provided', () => {
    const store = defineStore('some', {})()

    expect(store.$state).toEqual({})
  })

  it('can hydrate the state', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const useStore = defineStore('main', {
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })

    pinia.state.value.main = {
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    }

    const store = useStore()

    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string 2' },
      },
    })
  })

  it('can replace its state', () => {
    const store = useStore()
    const spy = vi.fn()
    watch(() => store.a, spy, { flush: 'sync' })
    expect(store.a).toBe(true)

    expect(spy).toHaveBeenCalledTimes(0)
    // TODO: remove once plugin state achieve generics
    // @ts-expect-error
    store.$state = {
      a: false,
      nested: {
        foo: 'bar',
        a: {
          b: 'hey',
        },
      },
    }
    expect(spy).toHaveBeenCalledTimes(1)

    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'hey' },
      },
    })
  })

  it('do not share the state between same id store', () => {
    const store = useStore()
    const store2 = useStore(createPinia())
    expect(store.$state).not.toBe(store2.$state)
    store.$state.nested.a.b = 'hey'
    expect(store2.$state.nested.a.b).toBe('string')
  })

  it('should outlive components', async () => {
    const pinia = createPinia()
    const useStore = defineStore('main', {
      state: () => ({ n: 0 }),
    })

    const wrapper = mount(
      {
        setup() {
          const store = useStore()

          return { store }
        },

        template: `n: {{ store.n }}`,
      },
      {
        global: {
          plugins: [pinia],
        },
      }
    )

    expect(wrapper.html()).toBe('n: 0')

    const store = useStore(pinia)

    const spy = vi.fn()
    watch(() => store.n, spy)

    expect(spy).toHaveBeenCalledTimes(0)
    store.n++
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.html()).toBe('n: 1')

    wrapper.unmount()
    await nextTick()
    store.n++
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should not break getCurrentInstance', () => {
    let store: ReturnType<typeof useStore> | undefined

    let i1: any = {}
    let i2: any = {}
    const wrapper = mount(
      {
        setup() {
          i1 = getCurrentInstance()
          store = useStore()
          i2 = getCurrentInstance()

          return { store }
        },

        template: `a: {{ store.a }}`,
      },
      {
        global: {
          plugins: [createPinia()],
        },
      }
    )

    expect(i1 === i2).toBe(true)

    wrapper.unmount()
  })

  it('reuses stores from parent components', () => {
    let s1, s2
    const useStore = defineStore('one', {})
    const pinia = createPinia()

    const Child = defineComponent({
      setup() {
        s2 = useStore()
      },
      template: `child`,
    })

    mount(
      {
        setup() {
          s1 = useStore()
          return { s1 }
        },
        components: { Child },
        template: `<child/>`,
      },
      { global: { plugins: [pinia] } }
    )

    expect(s1).toBeDefined()
    expect(s1 === s2).toBe(true)
  })

  it('can share the same pinia in two completely different instances', async () => {
    const useStore = defineStore('one', { state: () => ({ n: 0 }) })
    const pinia = createPinia()

    const Comp = defineComponent({
      setup() {
        const store = useStore()
        return { store }
      },
      template: `{{ store.n }}`,
    })

    const One = mount(Comp, {
      global: {
        plugins: [pinia],
      },
    })

    const Two = mount(Comp, {
      global: {
        plugins: [pinia],
      },
    })

    const store = useStore(pinia)

    expect(One.text()).toBe('0')
    expect(Two.text()).toBe('0')

    store.n++
    await nextTick()

    expect(One.text()).toBe('1')
    expect(Two.text()).toBe('1')
  })

  it('can be disposed', () => {
    const pinia = createPinia()
    const useStore = defineStore('main', { state: () => ({ n: 0 }) })

    const store = useStore(pinia)
    const spy = vi.fn()

    store.$subscribe(spy, { flush: 'sync' })
    pinia.state.value.main.n++
    expect(spy).toHaveBeenCalledTimes(1)

    expect(useStore()).toBe(store)
    store.$dispose()
    pinia.state.value.main.n++

    expect(spy).toHaveBeenCalledTimes(1)

    expect(useStore()).not.toBe(store)
  })

  const warnTextCheckPlainObject = (storeId: string) =>
    `The "state" must be a plain object. It cannot be\n\tstate: () => new MyClass()\nFound in store "${storeId}".`

  it('warns when state is created with a class constructor', () => {
    class MyState {}

    const useMyStore = defineStore('store', { state: () => new MyState() })
    useMyStore()
    expect(warnTextCheckPlainObject('store')).toHaveBeenWarned()
  })

  it('only warns about constructors when store is initially created', () => {
    class MyState {}
    const useMyStore = defineStore('arrowInit', { state: () => new MyState() })
    useMyStore()
    expect(warnTextCheckPlainObject('arrowInit')).toHaveBeenWarnedTimes(1)
  })

  it('does not warn when state is created with a plain object', () => {
    const useMyStore = defineStore('poInit', {
      state: () => ({ someValue: undefined }),
    })
    useMyStore()
    expect(warnTextCheckPlainObject('poInit')).toHaveBeenWarnedTimes(0)
  })

  it('warns when state name conflicts with getters name (with id as first argument)', () => {
    const useStore = defineStore('main', {
      state: () => ({ anyName: 0 }),
      getters: { anyName: (state) => state.anyName },
    })
    useStore()

    expect(
      `[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "anyName" in store "main".`
    ).toHaveBeenWarnedTimes(1)
  })
})
