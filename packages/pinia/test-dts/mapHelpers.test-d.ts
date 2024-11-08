import { computed, ref } from 'vue'
import {
  defineStore,
  expectType,
  mapStores,
  mapActions,
  mapState,
  mapWritableState,
  TypeEqual,
} from './'

const useOptionsStore = defineStore({
  id: 'name',
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
  function toggleA() {
    a.value = a.value === 'off' ? 'on' : 'off'
  }
  function setToggle(aVal: 'on' | 'off') {
    return (a.value = aVal)
  }
  return { a, upper, toggleA, setToggle }
})

const useCounter = defineStore({
  id: 'counter',
  state: () => ({ n: 0 }),
})

const useStoreDos = defineStore({
  id: 'dos',
  state: () => ({}),
})

type MainStore = ReturnType<typeof useOptionsStore>
type DosStore = ReturnType<typeof useStoreDos>
type CounterStore = ReturnType<typeof useCounter>

const computedStores = mapStores(useOptionsStore, useStoreDos, useCounter)

expectType<{
  nameStore: () => MainStore
  dosStore: () => DosStore
  counterStore: () => CounterStore
}>(computedStores)

// store with no getters
expectType<{
  n: () => number
}>(mapState(useCounter, ['n']))

expectType<{
  a: () => 'on' | 'off'
  upper: () => string
}>(mapState(useOptionsStore, ['a', 'upper']))

// @ts-expect-error
mapState(useOptionsStore, ['a']).nested

// @ts-expect-error
mapState(useOptionsStore, ['a', 'upper']).nested

expectType<{
  newA: () => 'on' | 'off'
  newUpper: () => string
}>(mapState(useOptionsStore, { newA: 'a', newUpper: 'upper' }))

expectType<{
  newA: () => 'on' | 'off'
  newUpper: () => string
}>(
  mapState(useOptionsStore, {
    newA: (store) => {
      expectType<string>(store.upper)
      return store.a
    },
    newUpper: 'upper',
  })
)

expectType<{
  setToggle: (a: 'on' | 'off') => 'on' | 'off'
  toggleA: () => void
}>(mapActions(useOptionsStore, ['setToggle', 'toggleA']))

expectType<{
  newSetToggle: (a: 'on' | 'off') => 'on' | 'off'
  newToggleA: () => void
}>(
  mapActions(useOptionsStore, {
    newSetToggle: 'setToggle',
    newToggleA: 'toggleA',
  })
)

expectType<{
  a: {
    get: () => 'on' | 'off'
    set: (v: 'on' | 'off') => any
  }
}>(mapWritableState(useOptionsStore, ['a']))
// @ts-expect-error: only defined in array
mapWritableState(useOptionsStore, ['a']).b

expectType<{
  newA: {
    get: () => 'on' | 'off'
    set: (v: 'on' | 'off') => any
  }
}>(mapWritableState(useOptionsStore, { newA: 'a' }))

// @ts-expect-error: cannot use a getter
mapWritableState(useOptionsStore, ['upper'])
// @ts-expect-error: cannot use a getter
mapWritableState(useOptionsStore, { up: 'upper' })

const setupStoreWithState = mapState(useSetupStore, ['a'])

// store with no getters
expectType<
  TypeEqual<
    {
      a: () => 'on' | 'off'
    },
    typeof setupStoreWithState
  >
>(true)

const setupStoreWithGetters = mapState(useSetupStore, ['a', 'upper'])

expectType<
  TypeEqual<
    {
      a: () => 'on' | 'off'
      upper: () => string
    },
    typeof setupStoreWithGetters
  >
>(true)
