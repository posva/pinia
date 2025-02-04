import { describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'

describe('Actions', () => {
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
      }),
      getters: {
        nonA(): boolean {
          return !this.a
        },
        otherComputed() {
          return this.nonA
        },
      },
      actions: {
        async getNonA() {
          return this.nonA
        },
        simple() {
          this.toggle()
          return 'simple'
        },

        toggle() {
          return (this.a = !this.a)
        },

        setFoo(foo: string) {
          this.$patch({ nested: { foo } })
        },

        combined() {
          this.toggle()
          this.setFoo('bar')
        },

        throws() {
          throw new Error('fail')
        },

        async rejects() {
          throw 'fail'
        },
      },
    })()
  }

  const useB = defineStore('B', { state: () => ({ b: 'b' }) })

  const useA = defineStore('A', {
    state: () => ({ a: 'a' }),
    actions: {
      swap() {
        const bStore = useB()
        const b = bStore.$state.b
        bStore.$state.b = this.$state.a
        this.$state.a = b
      },
    },
  })

  it('can use the store as this', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    store.toggle()
    expect(store.$state.a).toBe(false)
  })

  it('store is forced as the context', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    expect(() => {
      store.toggle.call(null)
    }).not.toThrow()
    expect(store.$state.a).toBe(false)
  })

  it('can call other actions', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    expect(store.$state.nested.foo).toBe('foo')
    store.combined()
    expect(store.$state.a).toBe(false)
    expect(store.$state.nested.foo).toBe('bar')
  })

  it('supports being called between two applications', () => {
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    setActivePinia(pinia1)
    const aStore = useA()

    // simulate a different application
    setActivePinia(pinia2)
    const bStore = useB()
    bStore.$state.b = 'c'

    aStore.swap()
    expect(aStore.$state.a).toBe('b')
    // a different instance of b store was used
    expect(bStore.$state.b).toBe('c')
  })

  it('can force the pinia', () => {
    // setup other pinias to force possible override effects on the options effect
    const pinia11 = createPinia()
    // const pinia22 = createPinia()
    setActivePinia(pinia11)
    useA()
    setActivePinia(undefined)

    const pinia1 = createPinia()
    const pinia2 = createPinia()
    const aStore = useA(pinia1)

    let bStore = useB(pinia2)
    bStore.$state.b = 'c'

    aStore.swap()
    expect(aStore.$state.a).toBe('b')
    // a different instance of b store was used
    expect(bStore.$state.b).toBe('c')
    bStore = useB(pinia1)
    expect(bStore.$state.b).toBe('a')
  })

  it('throws errors', () => {
    const store = useStore()
    expect(() => store.throws()).toThrowError('fail')
  })

  it('throws async errors', async () => {
    const store = useStore()
    expect.assertions(1)
    await expect(store.rejects()).rejects.toBe('fail')
  })

  it('can catch async errors', async () => {
    const store = useStore()
    expect.assertions(3)
    const spy = vi.fn()
    await expect(store.rejects().catch(spy)).resolves.toBe(undefined)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('fail')
  })

  it('can destructure actions', () => {
    const store = useStore()
    const { simple } = store
    expect(simple()).toBe('simple')
    // works with the wrong this
    expect({ simple }.simple()).toBe('simple')
    // special this check
    expect({ $id: 'o', simple }.simple()).toBe('simple')
    // override the function like devtools do
    expect(
      {
        $id: store.$id,
        simple,
        // otherwise it would fail
        toggle() {},
      }.simple()
    ).toBe('simple')
  })
})
