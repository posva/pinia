import { beforeEach, describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'
import { createPinia, defineStore, setActivePinia } from '../src'

function expectType<T>(_value: T): void {}

describe('Getters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      name: 'Eduardo',
    }),
    getters: {
      upperCaseName(store) {
        return store.name.toUpperCase()
      },
      doubleName(): string {
        return this.upperCaseName
      },
      composed(): string {
        return this.upperCaseName + ': ok'
      },
      arrowUpper: (state) => {
        // @ts-expect-error
        state.nope
        state.name.toUpperCase()
      },
    },
    actions: {
      o() {
        // @ts-expect-error it should type getters
        this.arrowUpper.toUpperCase()
        this.o().toUpperCase()
        return 'a string'
      },
    },
  })

  const useB = defineStore('B', { state: () => ({ b: 'b' }) })

  const useA = defineStore('A', {
    state: () => ({ a: 'a' }),
    getters: {
      fromB(): string {
        const bStore = useB()
        return this.a + ' ' + bStore.b
      },
    },
  })

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName).toBe('EDUARDO')

    // @ts-expect-error
    store.nope

    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('supports changing between applications', () => {
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    setActivePinia(pinia1)
    const aStore = useA()

    // simulate a different application
    setActivePinia(pinia2)
    const bStore = useB()
    bStore.b = 'c'

    aStore.a = 'b'
    expect(aStore.fromB).toBe('b b')
  })

  it('can use other getters', () => {
    const store = useStore()
    expect(store.composed).toBe('EDUARDO: ok')
    store.name = 'Ed'
    expect(store.composed).toBe('ED: ok')
  })

  it('keeps getters reactive when hydrating', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    pinia.state.value = { main: { name: 'Jack' } }
    const store = useStore()
    expect(store.name).toBe('Jack')
    expect(store.upperCaseName).toBe('JACK')
    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('can use getters with setters', () => {
    const useStore = defineStore('main', () => {
      const name = ref('Eduardo')
      const upperCaseName = computed({
        get() {
          return name.value.toUpperCase()
        },
        set(value: string) {
          store.name = value.toLowerCase()
        },
      })
      return { name, upperCaseName }
    })

    const store = useStore()
    expect(store.upperCaseName).toBe('EDUARDO')
    store.upperCaseName = 'ED'
    expect(store.name).toBe('ed')
  })

  it('can use getters with setters with different types', () => {
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

    const store = useStore()
    expect(store.$state).not.toHaveProperty('double')
    store.double = 4
    expect(store.n).toBe(2)
    // @ts-expect-error: still not doable
    store.double = '6'
    expect(store.n).toBe(3)
  })

  describe('cross used stores', () => {
    const useA = defineStore('a', () => {
      const B = useB()

      const n = ref(0)
      const double = computed(() => n.value * 2)
      const sum = computed(() => n.value + B.n)

      function increment() {
        return n.value++
      }

      function incrementB() {
        return B.increment()
      }

      return { n, double, sum, increment, incrementB }
    })

    const useB = defineStore('b', () => {
      const A = useA()

      const n = ref(0)
      const double = computed(() => n.value * 2)

      function increment() {
        return n.value++
      }

      function incrementA() {
        return A.increment()
      }

      return { n, double, incrementA, increment }
    })

    it('keeps getters reactive', () => {
      const a = useA()
      const b = useB()

      expectType<() => number>(a.increment)
      expectType<() => number>(b.increment)
      expectType<() => number>(a.incrementB)
      expectType<() => number>(b.incrementA)

      expect(a.double).toBe(0)
      b.incrementA()
      expect(a.double).toBe(2)
      a.increment()
      expect(a.double).toBe(4)

      expect(b.double).toBe(0)
      a.incrementB()
      expect(b.double).toBe(2)
      b.increment()
      expect(b.double).toBe(4)
    })
  })
})
