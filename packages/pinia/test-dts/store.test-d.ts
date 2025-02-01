import {
  StoreGeneric,
  acceptHMRUpdate,
  defineStore,
  expectType,
  storeToRefs,
} from './'
import { computed, Ref, ref, UnwrapRef, watch, WritableComputedRef } from 'vue'

const useStore = defineStore('name', {
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper: (state) => {
      expectType<'on' | 'off'>(state.a)
      return state.a.toUpperCase() as 'ON' | 'OFF'
    },
    upperThis(): 'ON' | 'OFF' {
      expectType<'on' | 'off'>(this.a)
      return this.a.toUpperCase() as 'ON' | 'OFF'
    },
    other(): false {
      expectType<string>(this.upper)
      return false
    },

    doubleCounter: (state) => {
      expectType<number>(state.nested.counter)
      return state.nested.counter * 2
    },
  },
  actions: {
    doStuff() {
      // @ts-expect-error
      this.notExisting
      expectType<string>(this.upper)
      expectType<false>(this.other)
    },
    otherOne() {
      expectType<() => void>(this.doStuff)
    },
  },
})

defineStore('name', {})
// @ts-expect-error
defineStore('name')
defineStore('name', {
  state: () => ({}),
})

// actions on not existing properties
defineStore('', {
  actions: {
    a() {
      // @ts-expect-error
      this.notExisting
    },
  },
})

defineStore('', {
  state: () => ({}),
  actions: {
    a() {
      // @ts-expect-error
      this.notExisting
    },
  },
})

defineStore('', {
  getters: {},
  actions: {
    a() {
      // @ts-expect-error
      this.notExisting
    },
  },
})

interface Model {
  id: number
}

// Define generic factory function
export function init<User extends Model>(name = 'settings') {
  return defineStore(name, {
    state: () => {
      return {
        // Set one of the properties to the generic type
        user: {} as User,
      }
    },
    actions: {
      // Add action which accepts argument with our generic type
      set(u: UnwrapRef<User>) {
        // See linter error when trying to assign arg value to the state
        this.user = u
      },
    },
  })
}

const s = init()()
s.set({ id: 1 })

// getters on not existing properties
defineStore('', {
  getters: {
    a(): number {
      // @ts-expect-error
      this.notExisting
      return 2
    },
    b: (state) => {
      // @ts-expect-error
      state.notExisting
      return
    },
  },
})

defineStore('', {
  state: () => ({}),
  getters: {
    a(): number {
      // @ts-expect-error
      this.notExisting
      return 2
    },
    b: (state) => {
      // @ts-expect-error
      state.notExisting
      return
    },
  },
})

const store = useStore()

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}

expectType<{ a: 'on' | 'off' }>(store.$state)
expectType<number>(store.nested.counter)
expectType<'on' | 'off'>(store.a)
expectType<'ON' | 'OFF'>(store.upper)

// @ts-expect-error
store.nonExistant

// @ts-expect-error
store.upper = 'thing'

// @ts-expect-error
store.nonExistant.stuff

// @ts-expect-error cannot return a value
store.$patch(async () => {})
store.$patch(() => {})
store.$patch(() => {
  // return earlier
  return
})

const useNoSAG = defineStore('noSAG', {})
const useNoAG = defineStore('noAG', { state: () => ({}) })
const useNoSG = defineStore('noAG', { actions: {} })
const useNoSA = defineStore('noAG', { getters: {} })
const useNoS = defineStore('noAG', { actions: {}, getters: {} })
const useNoA = defineStore('noAG', { state: () => ({}), getters: {} })
const useNoG = defineStore('noAG', { state: () => ({}), actions: {} })

const noSAG = useNoSAG()
const noSA = useNoSA()
const noAG = useNoAG()
const noSG = useNoSG()
const noS = useNoS()
const noA = useNoA()
const noG = useNoG()

// @ts-expect-error
store.notExisting

// @ts-expect-error
noSAG.notExisting
// @ts-expect-error
noSAG.$state.hey

// @ts-expect-error
noSA.notExisting
// @ts-expect-error
noSA.notExisting
// @ts-expect-error
noAG.notExisting
// @ts-expect-error
noSG.notExisting
// @ts-expect-error
noS.notExisting
// @ts-expect-error
noA.notExisting
// @ts-expect-error
noG.notExisting

function takeStore<TStore extends StoreGeneric>(store: TStore): TStore['$id'] {
  return store.$id
}

export const useSyncValueToStore = <
  TStore extends StoreGeneric,
  TKey extends keyof TStore['$state'],
>(
  propGetter: () => TStore[TKey],
  store: TStore,
  key: TKey
): void => {
  watch(
    propGetter,
    (propValue) => {
      store[key] = propValue
    },
    {
      immediate: true,
    }
  )
}

useSyncValueToStore(() => 'on' as const, store, 'a')
// @ts-expect-error
useSyncValueToStore(() => true, store, 'a')
takeStore(store)
takeStore(noSAG)
// @ts-expect-error
useSyncValueToStore(() => 2, noSAG, 'nope')
// @ts-expect-error
useSyncValueToStore(() => null, noSAG, 'myState')
takeStore(noSA)
takeStore(noAG)
useSyncValueToStore(() => 2, noAG, 'myState')
takeStore(noSG)
takeStore(noS)
takeStore(noA)
useSyncValueToStore(() => 2, noA, 'myState')
takeStore(noG)
useSyncValueToStore(() => 2, noG, 'myState')

declare var genericStore: StoreGeneric

// should not fail like it does with Store
expectType<any>(genericStore.thing)
expectType<any>(genericStore.$state.thing)
takeStore(genericStore)
useSyncValueToStore(() => 2, genericStore, 'myState')
// @ts-expect-error: this type is known so it should yield an error
useSyncValueToStore(() => false, genericStore, 'myState')
useSyncValueToStore(() => 2, genericStore, 'random')

const writableComputedStore = defineStore('computed-writable', () => {
  const fruitsBasket = ref(['banana', 'apple', 'banana', 'orange'])
  const total = computed(() => fruitsBasket.value.length)
  const bananasAmount = computed<number>({
    get: () => fruitsBasket.value.filter((fruit) => fruit === 'banana').length,
    set: (newAmount) => {
      fruitsBasket.value = fruitsBasket.value.filter(
        (fruit) => fruit !== 'banana'
      )
      fruitsBasket.value.push(...Array(newAmount).fill('banana'))
    },
  })
  const bananas = computed({
    get: () => fruitsBasket.value.filter((fruit) => fruit === 'banana'),
    set: (newFruit: string) =>
      (fruitsBasket.value = fruitsBasket.value.map((fruit) =>
        fruit === 'banana' ? newFruit : fruit
      )),
  })
  bananas.value = 'hello' // TS ok
  return { fruitsBasket, bananas, bananasAmount, total }
})()

expectType<number>(writableComputedStore.bananasAmount)
// should allow writing to it
writableComputedStore.bananasAmount = 0
// @ts-expect-error: this one is readonly
writableComputedStore.total = 0
expectType<string[]>(writableComputedStore.bananas)
// should allow setting a different type
// @ts-expect-error: still not doable
writableComputedStore.bananas = 'hello'

const refs = storeToRefs(writableComputedStore)
expectType<string[]>(refs.bananas.value)
expectType<number>(refs.bananasAmount.value)
refs.bananasAmount.value = 0
// @ts-expect-error: this one is readonly
refs.total.value = 0

const refStore = defineStore('ref-bananas', () => {
  const bananas = ref(['banana1', 'banana2'])
  return { bananas }
})()
declare const conditionalStore: typeof refStore | typeof writableComputedStore
expectType<Ref<string[]> | WritableComputedRef<'banana'[]>>(
  storeToRefs(conditionalStore).bananas
)
