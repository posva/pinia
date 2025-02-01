import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'
import { computed, createApp, inject, nextTick, ref, watch } from 'vue'
import { mount } from '@vue/test-utils'

function expectType<T>(_value: T): void {}

describe('store with setup syntax', () => {
  function mainFn() {
    const name = ref('Eduardo')
    const counter = ref(0)
    function increment(amount = 1) {
      counter.value += amount
    }
    const double = computed(() => counter.value * 2)

    return { name, counter, increment, double }
  }

  const useStore = defineStore('main', mainFn)

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should extract the $state', () => {
    const store = useStore()
    expectType<{ name: string; counter: number }>(store.$state)
    expect(store.$state).toEqual({ name: 'Eduardo', counter: 0 })
    expect(store.name).toBe('Eduardo')
    expect(store.counter).toBe(0)
    expect(store.double).toBe(0)
    store.increment()
    expect(store.counter).toBe(1)
    expect(store.double).toBe(2)
    expect(store.$state).toEqual({ name: 'Eduardo', counter: 1 })
    expect(store.$state).not.toHaveProperty('double')
    expect(store.$state).not.toHaveProperty('increment')
  })

  it('can store a function', () => {
    const store = defineStore('main', () => {
      const fn = ref(() => {})
      function action() {}
      return { fn, action }
    })()
    expectType<{ fn: () => void }>(store.$state)
    expect(store.$state).toEqual({ fn: expect.any(Function) })
    expect(store.fn).toEqual(expect.any(Function))
    store.action()
  })

  it('can directly access state at the store level', () => {
    const store = useStore()

    expect(store.name).toBe('Eduardo')
    store.name = 'Ed'
    expect(store.name).toBe('Ed')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('EDUARDO')
    store.name = 'Ed'
    expect(upperCased.value).toBe('ED')
  })

  it('state can be watched', async () => {
    const store = useStore()
    const spy = vi.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    store.name = 'Ed'
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  // TODO: could be fixed by using computed or getters + setters in store
  it.skip('state refs can be watched', async () => {
    const store = useStore()
    const spy = vi.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    const nameRef = ref('Ed')
    store._p.state.value[store.$id].name = nameRef
    // @ts-ignore
    // store.$state.name = nameRef
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('unwraps refs', () => {
    const name = ref('Eduardo')
    const counter = ref(0)
    const double = computed({
      get: () => counter.value * 2,
      set(val) {
        counter.value = val / 2
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const useStore = defineStore('main', {
      state: () => ({
        name,
        counter,
        double,
      }),
    })

    const store = useStore()

    expect(store.name).toBe('Eduardo')
    expect(store.$state.name).toBe('Eduardo')
    expect(pinia.state.value.main).toEqual({
      name: 'Eduardo',
      counter: 0,
      double: 0,
    })

    name.value = 'Ed'
    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')
    expect(pinia.state.value.main.name).toBe('Ed')

    store.name = 'Edu'
    expect(store.name).toBe('Edu')

    store.$patch({ counter: 2 })
    expect(store.counter).toBe(2)
    expect(counter.value).toBe(2)
  })

  it('can use app level injections', async () => {
    const pinia = createPinia()
    const app = createApp({}).use(pinia)
    app.provide('hello', 'pinia')
    const useStore = defineStore('id', () => {
      const injected = ref(inject('hello', 'nope'))

      return { injected }
    })

    const store = useStore()
    expect(store.injected).toBe('pinia')
  })

  // TODO: until https://github.com/vuejs/test-utils/issues/2059 is fixed
  it.skip('injects level app injections even within components', async () => {
    const pinia = createPinia()
    const useStore = defineStore('id', () => {
      const injected = ref(inject('hello', 'nope'))

      return { injected }
    })

    const NestedComponent = {
      template: '<div>{{ injected }}</div>',
      setup() {
        const store = useStore()
        return { injected: store.injected }
      },
    }
    const Component = {
      template: '<NestedComponent />',
      components: { NestedComponent },
      setup() {
        // provide('hello', 'component')
        return {}
      },
    }
    const wrapper = mount(Component, {
      global: {
        plugins: [pinia],
        provide: {
          hello: 'pinia',
        },
      },
    })
    expect(wrapper.text()).toBe('pinia')
  })
})
