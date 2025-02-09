import {
  expectType,
  createPinia,
  defineStore,
  mapStores,
  _ActionsTree,
  storeToRefs,
} from './'
import { App, computed, ComputedRef, ref, Ref } from 'vue'

declare module '../dist/pinia' {
  export interface MapStoresCustomization {
    suffix: 'Store'
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    $actions: Array<keyof A>
    myState: number

    set canBeARef(value: number | Ref<number>)
    get canBeARef(): number
  }

  export interface PiniaCustomStateProperties<S> {
    myState: number
    stateOnly: number
  }

  export interface DefineStoreOptionsBase<S, Store> {
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }

  // export interface DefineStoreOptions<Id, S, G, A> {
  //   debounce?: Partial<Record<keyof A, number>>
  // }
}

const pinia = createPinia()

pinia.use((context) => {
  expectType<_ActionsTree>(context.options.actions)
  expectType<string>(context.store.$id)
  expectType<App>(context.app)

  expectType<number>(context.store.$state.myState)
  expectType<number>(context.store.myState)

  expectType<number>(context.store.canBeARef)
  // it can be set to both a ref and a number
  context.store.canBeARef = ref(2)
  context.store.canBeARef = 3
  // @ts-expect-error
  context.store.canBeARef = 'eou'

  return {
    $actions: Object.keys(context.options.actions || {}),
  }
})

const useStore = defineStore('main', {
  actions: {
    one() {},
    two() {
      this.one()
      expectType<number>(this.$state.myState)
      expectType<number>(this.myState)
    },
    three() {
      this.two()
    },
  },

  getters: {
    two(state): boolean {
      expectType<number>(this.myState)
      expectType<number>(state.myState)
      expectType<number>(state.stateOnly)

      // @ts-expect-error
      this.stateOnly

      return true
    },
  },

  debounce: {
    one: 200,
    two: 300,
    // three: 100
  },
})

defineStore(
  'withSetup',
  () => {
    function one() {}
    function two() {}
    function three() {}

    return { one, two, three }
  },
  {
    debounce: {
      one: 200,
      two: 300,
    },
  }
)

type Procedure = (...args: any[]) => any

function debounce<F extends Procedure>(fn: F, time: number = 200) {
  return fn
}

expectType<{
  mainStore: () => ReturnType<typeof useStore>
}>(mapStores(useStore))

pinia.use(({ options, store }) => {
  const { debounce: debounceOptions } = options
  if (debounceOptions) {
    return Object.keys(debounceOptions).reduce(
      (debouncedActions, action) => {
        debouncedActions[action] = debounce(
          store[action],
          debounceOptions[action]
        )
        return debouncedActions
      },
      {} as Record<string, (...args: any[]) => any>
    )
  }
})

expectType<{ myState: Ref<number>; stateOnly: Ref<number> }>(
  storeToRefs(defineStore('a', {})())
)

expectType<{
  a: Ref<boolean>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  // @ts-expect-error: no a
  storeToRefs(defineStore('a', {})())
)

expectType<{
  $onAction: Ref<unknown>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  // @ts-expect-error: doesn't add store methods
  storeToRefs(defineStore('a', {})())
)

expectType<{ a: Ref<boolean>; myState: Ref<number>; stateOnly: Ref<number> }>(
  storeToRefs(defineStore('a', { state: () => ({ a: true }) })())
)

expectType<{
  n: Ref<number>
  double: ComputedRef<number>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  storeToRefs(
    defineStore('a', {
      state: () => ({ n: 1 }),
      getters: {
        double: (state) => state.n * 2,
      },
    })()
  )
)

expectType<{
  n: Ref<number>
  double: ComputedRef<number>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  storeToRefs(
    defineStore('a', () => {
      const n = ref(1)
      const double = computed(() => n.value * 2)
      return {
        n,
        double,
      }
    })()
  )
)

expectType<{
  n: Ref<number>
  customN: Ref<number> & { plusOne: () => void }
  double: ComputedRef<number>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  storeToRefs(
    defineStore('a', () => {
      const n = ref(1)
      const customN = ref(1) as Ref<number> & { plusOne: () => void }
      const double = computed(() => n.value * 2)
      return {
        n,
        customN,
        double,
      }
    })()
  )
)

expectType<{
  n: Ref<number>
  customN: Ref<number> & { plusOne: () => void }
  double: ComputedRef<number>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  storeToRefs(
    defineStore('a', () => {
      const n = ref(1)
      const customN = ref(1) as Ref<number> & { plusOne: () => void }
      const double = computed(() => n.value * 2)

      function plusOne() {
        customN.value++
      }

      return {
        n,
        customN,
        double,
        plusOne,
      }
    })()
  )
)

expectType<{
  n: Ref<number>
  customN: Ref<number> & { plusOne: () => void }
  double: ComputedRef<number>
  myState: Ref<number>
  stateOnly: Ref<number>
}>(
  storeToRefs(
    defineStore('a', {
      state: () => ({
        n: 1,
        customN: ref(1) as Ref<number> & { plusOne: () => void },
      }),
      getters: {
        double: (state) => state.n * 2,
      },
      actions: {
        plusOne() {
          this.n++
        },
      },
    })()
  )
)
