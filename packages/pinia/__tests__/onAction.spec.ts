import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('Subscriptions', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore('main', {
      state: () => ({
        user: 'Eduardo',
      }),
      actions: {
        direct(name: string) {
          this.user = name
        },
        patchObject(user: string) {
          this.$patch({ user })
        },
        patchFn(name: string) {
          this.$patch((state) => {
            state.user = name
          })
        },
        async asyncUpperName() {
          return this.user.toUpperCase()
        },
        upperName() {
          return this.user.toUpperCase()
        },
        throws(e: any) {
          throw e
        },
        async rejects(e: any) {
          throw e
        },
      },
    })()
  }

  let store: ReturnType<typeof useStore>
  beforeEach(() => {
    store = useStore()
  })

  it('fires callback when action is called', () => {
    const spy = vi.fn()
    store.$onAction(spy)
    store.direct('Cleiton')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'direct',
        args: ['Cleiton'],
        store,
      })
    )
  })

  it('removes the callback when unsubscribe is called', () => {
    const spy = vi.fn()
    const unsubscribe = store.$onAction(spy)
    unsubscribe()
    store.direct('Cleiton')
    expect(spy).not.toHaveBeenCalled()
  })

  it('can register multiple onAction', async () => {
    const spy1 = vi.fn()
    const spy2 = vi.fn()
    store.$onAction(({ after }) => {
      after(spy1)
    })
    store.$onAction(({ after }) => {
      after(spy2)
    })

    await expect(store.asyncUpperName()).resolves.toBe('EDUARDO')
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy1).toHaveBeenCalledTimes(1)
  })

  it('calls after with the returned value', async () => {
    const spy = vi.fn()
    // Cannot destructure because of https://github.com/microsoft/TypeScript/issues/38020
    store.$onAction((context) => {
      if (context.name === 'upperName') {
        context.after((ret) => {
          // @ts-expect-error
          ret * 2
          ret.toUpperCase()
        })
      }
      context.after(spy)
    })
    expect(store.upperName()).toBe('EDUARDO')
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('EDUARDO')
  })

  it('calls after with the resolved value', async () => {
    const spy = vi.fn()
    store.$onAction(({ after }) => {
      after(spy)
    })
    await expect(store.asyncUpperName()).resolves.toBe('EDUARDO')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('EDUARDO')
  })

  it('calls onError when it throws', () => {
    const spy = vi.fn()
    store.$onAction(({ onError }) => {
      onError(spy)
    })
    expect(() => store.throws('fail')).toThrow()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('fail')
  })

  it('calls onError when it rejects', async () => {
    const spy = vi.fn()
    expect.assertions(3)
    store.$onAction(({ onError }) => {
      onError(spy)
    })
    await expect(store.rejects('fail')).rejects.toBe('fail')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('fail')
  })

  it('listeners are not affected when unsubscribe is called multiple times', () => {
    const func1 = vi.fn()
    const func2 = vi.fn()
    const unsubscribe1 = store.$onAction(func1)
    store.$onAction(func2)
    unsubscribe1()
    unsubscribe1()
    store.direct('Cleiton')
    expect(func1).not.toHaveBeenCalled()
    expect(func2).toHaveBeenCalledTimes(1)
  })

  it('can listen to setup actions within other actions thanks to `action`', () => {
    const store = defineStore('id', ({ action }) => {
      const a1 = action(() => 1)
      const a2 = action(() => a1() * 2)
      return { a1, a2 }
    })()
    const spy = vi.fn()
    store.$onAction(spy)
    store.a1()
    expect(spy).toHaveBeenCalledTimes(1)

    store.a2()
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ name: 'a2' })
    )
    expect(spy).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ name: 'a1' })
    )
  })

  describe('multiple store instances', () => {
    const useStore = defineStore('main', {
      state: () => ({
        name: 'Eduardo',
      }),

      actions: {
        changeName(name: string) {
          this.name = name
        },
      },
    })

    it('triggers subscribe only once', async () => {
      setActivePinia(createPinia())
      const s1 = useStore()
      const s2 = useStore()

      expect(s2).toBe(s1)

      const spy1 = vi.fn()
      const spy2 = vi.fn()

      s1.$onAction(spy1)
      s2.$onAction(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.changeName('Edu')

      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
    })

    it('removes on unmount', async () => {
      const pinia = createPinia()
      const spy1 = vi.fn()
      const spy2 = vi.fn()

      const wrapper = mount(
        {
          setup() {
            const s1 = useStore()
            s1.$onAction(spy1)
          },
          template: `<p/>`,
        },
        { global: { plugins: [pinia] } }
      )

      const s1 = useStore()
      const s2 = useStore()

      s2.$onAction(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.changeName('Cleiton')

      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy1).toHaveBeenCalledTimes(1)

      s1.changeName('other')
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(2)

      wrapper.unmount()
      await nextTick()

      s1.changeName('again')
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(3)
    })
  })
})
