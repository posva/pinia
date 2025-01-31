import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, defineStore, MutationType, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

describe('Subscriptions', () => {
  const useOptionsStore = defineStore('main', {
    state: () => ({
      user: 'Eduardo',
    }),
  })

  const useSetupStore = defineStore('main', () => {
    return {
      user: ref('Eduardo'),
    }
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe.each([
    { useStore: useOptionsStore, name: 'Options Stores' },
    { useStore: useSetupStore, name: 'Setup Stores' },
  ])('with: $name', ({ useStore }) => {
    it('fires callback changed through $state', () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy, { flush: 'sync' })
      store.$state.user = 'Cleiton'
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 'main',
          type: MutationType.direct,
        }),
        store.$state
      )
    })

    it('fires callback when changed througg store', async () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy)
      expect(spy).toHaveBeenCalledTimes(0)
      store.user = 'Cleiton'
      await nextTick()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('subscribe to changes done via patch', () => {
      const store = useStore()
      const spy = vi.fn()
      store.$subscribe(spy, { flush: 'sync' })

      const patch = { user: 'Cleiton' }
      store.$patch(patch)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: patch,
          storeId: 'main',
          type: MutationType.patchObject,
        }),
        store.$state
      )
    })
    const flushOptions = ['post', 'pre', 'sync'] as const

    flushOptions.forEach((flush) => {
      it('calls once inside components with flush ' + flush, async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const spy1 = vi.fn()

        mount(
          {
            setup() {
              const s1 = useStore()
              s1.$subscribe(spy1, { flush })
            },
            template: `<p/>`,
          },
          { global: { plugins: [pinia] } }
        )

        const s1 = useStore()

        expect(spy1).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(1)

        s1.$patch({ user: 'a' })
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(2)

        s1.$patch((state) => {
          state.user = 'other'
        })
        await nextTick()
        await nextTick()
        expect(spy1).toHaveBeenCalledTimes(3)
      })
    })

    it('works with multiple different flush', async () => {
      const spyPre = vi.fn()
      const spyPost = vi.fn()
      const spySync = vi.fn()

      const s1 = useStore()
      s1.$subscribe(spyPre, { flush: 'pre' })
      s1.$subscribe(spyPost, { flush: 'post' })
      s1.$subscribe(spySync, { flush: 'sync' })

      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(0)

      s1.user = 'Edu'
      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(1)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(1)

      s1.$patch({ user: 'a' })
      // patch still triggers all subscriptions immediately
      expect(spyPre).toHaveBeenCalledTimes(2)
      expect(spyPost).toHaveBeenCalledTimes(2)
      expect(spySync).toHaveBeenCalledTimes(2)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(2)
      expect(spyPost).toHaveBeenCalledTimes(2)
      expect(spySync).toHaveBeenCalledTimes(2)

      s1.$patch((state) => {
        state.user = 'other'
      })
      expect(spyPre).toHaveBeenCalledTimes(3)
      expect(spyPost).toHaveBeenCalledTimes(3)
      expect(spySync).toHaveBeenCalledTimes(3)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(3)
      expect(spyPost).toHaveBeenCalledTimes(3)
      expect(spySync).toHaveBeenCalledTimes(3)
    })

    it('works with multiple different flush and multiple state changes', async () => {
      const spyPre = vi.fn()
      const spyPost = vi.fn()
      const spySync = vi.fn()

      const s1 = useStore()
      s1.$subscribe(spyPre, { flush: 'pre' })
      s1.$subscribe(spyPost, { flush: 'post' })
      s1.$subscribe(spySync, { flush: 'sync' })

      s1.user = 'Edu'
      expect(spyPre).toHaveBeenCalledTimes(0)
      expect(spyPost).toHaveBeenCalledTimes(0)
      expect(spySync).toHaveBeenCalledTimes(1)
      s1.$patch({ user: 'a' })
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(2)
      await nextTick()
      expect(spyPre).toHaveBeenCalledTimes(1)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(spySync).toHaveBeenCalledTimes(2)
    })

    it('unsubscribes callback when unsubscribe is called', () => {
      const spy = vi.fn()
      const store = useStore()
      const unsubscribe = store.$subscribe(spy, { flush: 'sync' })
      unsubscribe()
      store.$state.user = 'Cleiton'
      expect(spy).not.toHaveBeenCalled()
    })

    it('listeners are not affected when unsubscribe is called multiple times', () => {
      const func1 = vi.fn()
      const func2 = vi.fn()
      const store = useStore()
      const unsubscribe1 = store.$subscribe(func1, { flush: 'sync' })
      store.$subscribe(func2, { flush: 'sync' })
      unsubscribe1()
      unsubscribe1()
      store.$state.user = 'Cleiton'
      expect(func1).not.toHaveBeenCalled()
      expect(func2).toHaveBeenCalledTimes(1)
    })

    describe('multiple', () => {
      it('triggers subscribe only once', async () => {
        const s1 = useStore()
        const s2 = useStore()

        const spy1 = vi.fn()
        const spy2 = vi.fn()

        s1.$subscribe(spy1, { flush: 'sync' })
        s2.$subscribe(spy2, { flush: 'sync' })

        expect(spy1).toHaveBeenCalledTimes(0)
        expect(spy2).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'

        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)
      })

      it('triggers pre subscriptions only once on $patch', async () => {
        const s1 = useStore()
        const spy1 = vi.fn()

        s1.$subscribe(spy1, { flush: 'pre' })

        // First mutation: works as expected
        s1.$patch({ user: 'Edu' })
        // anything else than awaiting a non promise or Promise.resolve() works
        await false
        // await Promise.resolve(false)
        // adding an extra await works
        // await false
        // adding any other delay also works
        // await delay(20)
        // await nextTick()
        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy1).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: MutationType.direct }),
          s1.$state
        )

        s1.$patch({ user: 'Myk' })
        await nextTick()

        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy1).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: MutationType.direct }),
          s1.$state
        )
      })

      it('removes on unmount', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const spy1 = vi.fn()
        const spy2 = vi.fn()

        const wrapper = mount(
          {
            setup() {
              const s1 = useStore()
              s1.$subscribe(spy1, { flush: 'sync' })
            },
            template: `<p/>`,
          },
          { global: { plugins: [pinia] } }
        )

        const s1 = useStore()
        const s2 = useStore()

        s2.$subscribe(spy2, { flush: 'sync' })

        expect(spy1).toHaveBeenCalledTimes(0)
        expect(spy2).toHaveBeenCalledTimes(0)

        s1.user = 'Edu'
        expect(spy1).toHaveBeenCalledTimes(1)
        expect(spy2).toHaveBeenCalledTimes(1)

        s1.$patch({ user: 'a' })
        expect(spy1).toHaveBeenCalledTimes(2)
        expect(spy2).toHaveBeenCalledTimes(2)

        s1.$patch((state) => {
          state.user = 'other'
        })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(3)

        wrapper.unmount()
        await nextTick()

        s1.$patch({ user: 'b' })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(4)
        s1.$patch((state) => {
          state.user = 'c'
        })
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(5)
        s1.user = 'd'
        expect(spy1).toHaveBeenCalledTimes(3)
        expect(spy2).toHaveBeenCalledTimes(6)
      })
    })

    it('subscribe is post by default', async () => {
      const spy = vi.fn()
      const store = useStore()
      store.$subscribe(spy)
      store.$state.user = 'Cleiton'
      expect(spy).toHaveBeenCalledTimes(0)
      await nextTick()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 'main',
          type: MutationType.direct,
        }),
        store.$state
      )
    })

    it('subscribe once with patch', () => {
      const spy1 = vi.fn()
      const spy2 = vi.fn()
      const store = useStore()
      function once() {
        const unsubscribe = store.$subscribe(
          () => {
            spy1()
            unsubscribe()
          },
          { flush: 'sync' }
        )
      }
      once()
      store.$subscribe(spy2, { flush: 'sync' })
      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)
      store.$patch((state) => {
        state.user = 'a'
      })
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
      store.$patch((state) => {
        state.user = 'b'
      })
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(2)
    })

    it('debugger events should not be array when subscription is not trigger by patch', () => {
      const store = useStore()
      store.$subscribe(
        ({ type, events }) => {
          if (type === MutationType.direct) {
            expect(Array.isArray(events)).toBe(false)
          }
        },
        { flush: 'sync' }
      )
      store.$patch({ user: 'Edu' })
      store.user = 'a'
    })

    it('should trigger subscription when mutate state synchronously after patch', async () => {
      const store = useStore()
      const spy1 = vi.fn()
      const spy2 = vi.fn()
      const spy3 = vi.fn()
      store.$subscribe(spy1, { flush: 'sync' })
      store.$subscribe(spy2, { flush: 'pre' })
      store.$subscribe(spy3, { flush: 'post' })
      store.$patch({ user: 'Edu' })
      store.user = 'a'
      expect(spy1).toHaveBeenCalledTimes(2)
      await nextTick()
      expect(spy2).toHaveBeenCalledTimes(2)
      expect(spy3).toHaveBeenCalledTimes(2)
    })
  })
})
