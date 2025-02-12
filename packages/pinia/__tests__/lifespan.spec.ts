import { describe, it, expect, vi } from 'vitest'
import {
  createPinia,
  defineStore,
  disposePinia,
  getActivePinia,
  setActivePinia,
} from '../src'
import { mount } from '@vue/test-utils'
import {
  watch,
  nextTick,
  defineComponent,
  ref,
  Ref,
  onMounted,
  getCurrentInstance,
} from 'vue'

describe('Store Lifespan', () => {
  function defineMyStore() {
    return defineStore('main', {
      state: () => ({
        a: true,
        n: 0,
        aRef: ref(0),
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
      getters: {
        double(state) {
          return state.n * 2
        },
        notA(state) {
          return !state.a
        },
      },
    })
  }

  const pinia = createPinia()

  it('gets the active pinia outside of setup', () => {
    setActivePinia(pinia)
    expect(getCurrentInstance()).toBeFalsy()
    expect(getActivePinia()).toBe(pinia)
  })

  it('gets the active pinia inside of setup', () => {
    expect.assertions(3)
    const pinia = createPinia()
    setActivePinia(undefined)
    expect(getActivePinia()).toBe(undefined)

    mount(
      {
        template: 'no',
        setup() {
          expect(getActivePinia()).toBe(pinia)
        },
      },
      { global: { plugins: [pinia] } }
    )
    // and outside too
    expect(getActivePinia()).toBe(pinia)
  })

  it('state reactivity outlives component life', () => {
    const useStore = defineMyStore()

    const inComponentWatch = vi.fn()

    const Component = defineComponent({
      render: () => null,
      setup() {
        const store = useStore()
        watch(() => store.n, inComponentWatch, {
          flush: 'sync',
        })
        onMounted(() => {
          store.n++
        })
      },
    })

    const options = {
      global: {
        plugins: [pinia],
      },
    }

    let wrapper = mount(Component, options)
    wrapper.unmount()

    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    let store = useStore()
    store.n++
    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    wrapper = mount(Component, options)
    wrapper.unmount()

    expect(inComponentWatch).toHaveBeenCalledTimes(2)

    store = useStore()
    store.n++
    expect(inComponentWatch).toHaveBeenCalledTimes(2)
  })

  it('ref in state reactivity outlives component life', async () => {
    let n: Ref<number>
    const pinia = createPinia()
    setActivePinia(pinia)
    const globalWatch = vi.fn()
    const destroy = watch(() => pinia.state.value.a?.n, globalWatch)

    const useStore = defineStore('a', {
      state: () => {
        n = n || ref(0)
        return { n }
      },
    })

    const Component = defineComponent({
      render: () => null,
      setup() {
        const store = useStore()
        store.n++
      },
    })

    const options = {
      global: {
        plugins: [pinia],
      },
    }

    let wrapper = mount(Component, options)
    wrapper.unmount()
    await nextTick()

    expect(globalWatch).toHaveBeenCalledTimes(1)

    let store = useStore()
    store.n++
    await nextTick()
    expect(globalWatch).toHaveBeenCalledTimes(2)

    wrapper = mount(Component, options)
    wrapper.unmount()
    await nextTick()

    expect(globalWatch).toHaveBeenCalledTimes(3)

    store = useStore()
    store.n++
    await nextTick()
    expect(globalWatch).toHaveBeenCalledTimes(4)

    destroy()
  })

  it('dispose stops store reactivity', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const inStoreWatch = vi.fn()

    const useStore = defineStore('a', () => {
      const n = ref(0)
      watch(n, inStoreWatch, {
        flush: 'sync',
      })
      return { n }
    })

    const store = useStore()
    store.n++
    expect(inStoreWatch).toHaveBeenCalledTimes(1)

    disposePinia(pinia)
    store.n++
    expect(inStoreWatch).toHaveBeenCalledTimes(1)
  })
})
