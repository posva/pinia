import { describe, beforeEach, it, expect, vi } from 'vitest'
import { computed, reactive, ref, ToRefs } from 'vue'
import { createPinia, defineStore, setActivePinia, storeToRefs } from '../src'

describe('storeToRefs', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function objectOfRefs<O extends Record<any, any>>(o: O): ToRefs<O> {
    return Object.keys(o).reduce((newO, key) => {
      // @ts-expect-error: we only need to match
      newO[key] = expect.objectContaining({ value: o[key] })
      return newO
    }, {} as ToRefs<O>)
  }

  it('empty state', () => {
    expect(storeToRefs(defineStore('a', {})())).toEqual({})
    expect(storeToRefs(defineStore('a', () => {})())).toEqual({})
  })

  it('plain values', () => {
    const { a, b, c, d } = storeToRefs(
      defineStore('a', {
        state: () => ({ a: null as null | undefined, b: false, c: 1, d: 'd' }),
      })()
    )

    expect(a.value).toBe(null)
    expect(b.value).toBe(false)
    expect(c.value).toBe(1)
    expect(d.value).toBe('d')

    a.value = undefined
    expect(a.value).toBe(undefined)

    b.value = true
    expect(b.value).toBe(true)

    c.value = 2
    expect(c.value).toBe(2)

    d.value = 'e'
    expect(d.value).toBe('e')
  })

  it('setup store', () => {
    const store = defineStore('a', () => {
      return {
        a: ref<null | undefined>(null),
        b: ref(false),
        c: ref(1),
        d: ref('d'),
        r: reactive({ n: 1 }),
      }
    })()

    const { a, b, c, d, r } = storeToRefs(store)

    expect(a.value).toBe(null)
    expect(b.value).toBe(false)
    expect(c.value).toBe(1)
    expect(d.value).toBe('d')
    expect(r.value).toEqual({ n: 1 })

    a.value = undefined
    expect(a.value).toBe(undefined)

    b.value = true
    expect(b.value).toBe(true)

    c.value = 2
    expect(c.value).toBe(2)

    d.value = 'e'
    expect(d.value).toBe('e')

    r.value.n++
    expect(r.value).toEqual({ n: 2 })
    expect(store.r).toEqual({ n: 2 })
    store.r.n++
    expect(r.value).toEqual({ n: 3 })
    expect(store.r).toEqual({ n: 3 })
  })

  it('empty getters', () => {
    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 0 }),
        })()
      )
    ).toEqual(objectOfRefs({ n: 0 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          return { n: ref(0) }
        })()
      )
    ).toEqual(objectOfRefs({ n: 0 }))
  })

  it('contains getters', () => {
    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 1 }),
          getters: {
            double: (state) => state.n * 2,
          },
        })()
      )
    ).toEqual(objectOfRefs({ n: 1, double: 2 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          const n = ref(0)
          const double = computed(() => n.value * 2)
          return { n, double }
        })()
      )
    ).toEqual(objectOfRefs({ n: 1, double: 2 }))
  })

  it('contain plugin states', () => {
    const pinia = createPinia()
    // directly push because no app
    pinia._p.push(() => ({
      // @ts-expect-error: cannot set a ref yet
      pluginN: ref(20),
      // should not appear in refs
      shared: 10,
    }))
    setActivePinia(pinia)

    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 0 }),
        })()
      )
    ).toEqual(objectOfRefs({ n: 0, pluginN: 20 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          return { n: ref(0) }
        })()
      )
    ).toEqual(objectOfRefs({ n: 0, pluginN: 20 }))
  })

  it('preserve setters in getters', () => {
    const useStore = defineStore('main', () => {
      const n = ref(0)
      const double = computed({
        get() {
          return n.value * 2
        },
        set(value: string | number) {
          n.value =
            (typeof value === 'string' ? parseInt(value) || 0 : value) / 2
        },
      })
      return { n, double }
    })
    const refs = storeToRefs(useStore())
    refs.double.value = 4
    expect(refs.n.value).toBe(2)
  })

  it('keep reactivity', () => {
    const store = defineStore('a', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      return { n, double }
    })()

    const { double } = storeToRefs(store)

    // Assuming HMR operation
    // @ts-expect-error: hmr
    store.double =
      //
      computed(() => 1)

    expect(double.value).toEqual(1)
  })

  it('does not trigger getters', () => {
    const n = ref(0)
    const spy = vi.fn(() => n.value * 2)
    const store = defineStore('a', () => {
      const double = computed(spy)
      return { n, double }
    })()

    expect(spy).toHaveBeenCalledTimes(0)
    storeToRefs(store)
    expect(spy).toHaveBeenCalledTimes(0)
  })

  tds(() => {
    const store1 = defineStore('a', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      return { n, double }
    })()

    storeToRefs(store1).double
  })

  function tds(_fn: Function) {}
})
