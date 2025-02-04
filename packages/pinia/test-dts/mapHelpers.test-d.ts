import { computed, ref } from 'vue'
import {
  defineStore,
  mapStores,
  mapActions,
  mapState,
  mapWritableState,
} from './'
import { describe, it, expectTypeOf } from 'vitest'

describe('mapHelpers', () => {
  const useOptionsStore = defineStore('name', {
    state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
    getters: {
      upper: (state) => state.a.toUpperCase(),
    },
    actions: {
      toggleA() {
        this.a = this.a === 'off' ? 'on' : 'off'
      },

      setToggle(a: 'on' | 'off') {
        return (this.a = a)
      },
    },
  })

  const useSetupStore = defineStore('setupStore', () => {
    const a = ref('on' as 'on' | 'off')
    const upper = computed(() => a.value.toUpperCase())
    const writableUpper = computed({
      get: () => a.value.toUpperCase(),
      set: (v: 'on' | 'off') => (a.value = v),
    })
    function toggleA() {
      a.value = a.value === 'off' ? 'on' : 'off'
    }
    function setToggle(aVal: 'on' | 'off') {
      return (a.value = aVal)
    }
    return { a, upper, writableUpper, toggleA, setToggle }
  })

  const useCounter = defineStore('counter', { state: () => ({ n: 0 }) })

  const useStoreDos = defineStore('dos', { state: () => ({}) })

  type MainStore = ReturnType<typeof useOptionsStore>
  type DosStore = ReturnType<typeof useStoreDos>
  type CounterStore = ReturnType<typeof useCounter>

  describe('mapStores', () => {
    it('should map stores correctly', () => {
      const computedStores = mapStores(useOptionsStore, useStoreDos, useCounter)
      expectTypeOf<{
        nameStore: () => MainStore
        dosStore: () => DosStore
        counterStore: () => CounterStore
      }>(computedStores)
    })
  })

  describe('mapState', () => {
    it('should map state correctly for store with no getters', () => {
      expectTypeOf<{
        n: () => number
      }>(mapState(useCounter, ['n']))
    })

    it('should map state correctly for store with getters', () => {
      expectTypeOf<{
        a: () => 'on' | 'off'
        upper: () => string
      }>(mapState(useOptionsStore, ['a', 'upper']))
    })

    it('should map state with new keys', () => {
      expectTypeOf<{
        newA: () => 'on' | 'off'
        newUpper: () => string
      }>(mapState(useOptionsStore, { newA: 'a', newUpper: 'upper' }))
    })

    it('should map state with function keys', () => {
      expectTypeOf<{
        newA: () => 'on' | 'off'
        newUpper: () => string
      }>(
        mapState(useOptionsStore, {
          newA: (store) => {
            expectTypeOf<string>(store.upper)
            return store.a
          },
          newUpper: 'upper',
        })
      )
    })

    it('should map state for setup store', () => {
      const setupStoreWithState = mapState(useSetupStore, ['a'])
      expectTypeOf(setupStoreWithState).toEqualTypeOf<{
        a: () => 'on' | 'off'
      }>()

      const setupStoreWithGetters = mapState(useSetupStore, ['a', 'upper'])
      expectTypeOf(setupStoreWithGetters).toEqualTypeOf<{
        a: () => 'on' | 'off'
        upper: () => string
      }>()
    })
  })

  describe('mapActions', () => {
    it('should map actions correctly', () => {
      expectTypeOf<{
        setToggle: (a: 'on' | 'off') => 'on' | 'off'
        toggleA: () => void
      }>(mapActions(useOptionsStore, ['setToggle', 'toggleA']))

      expectTypeOf<{
        newSetToggle: (a: 'on' | 'off') => 'on' | 'off'
        newToggleA: () => void
      }>(
        mapActions(useOptionsStore, {
          newSetToggle: 'setToggle',
          newToggleA: 'toggleA',
        })
      )
    })
  })

  describe('mapWritableState', () => {
    it('should map writable state correctly', () => {
      expectTypeOf<{
        a: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useOptionsStore, ['a']))

      expectTypeOf<{
        newA: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useOptionsStore, { newA: 'a' }))

      expectTypeOf<{
        foo: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, { foo: 'a' }))

      expectTypeOf<{
        a: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, ['a']))

      expectTypeOf<{
        writableUpper: {
          get: () => string
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, ['writableUpper']))
    })
  })
})
