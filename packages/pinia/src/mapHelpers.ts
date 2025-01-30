import type { ComponentPublicInstance, ComputedRef, UnwrapRef } from 'vue'
import type {
  _GettersTree,
  _StoreWithGetters_Writable,
  StateTree,
  Store,
  StoreDefinition,
} from './types'

/**
 * Interface to allow customizing map helpers. Extend this interface with the
 * following properties:
 *
 * - `suffix`: string. Affects the suffix of `mapStores()`, defaults to `Store`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapStoresCustomization {
  // cannot be added or it wouldn't be able to be extended
  // suffix?: string
}

/**
 * For internal use **only**.
 */
export type _StoreObject<S> =
  S extends StoreDefinition<
    infer Ids,
    infer State,
    infer Getters,
    infer Actions
  >
    ? {
        [Id in `${Ids}${MapStoresCustomization extends Record<
          'suffix',
          infer Suffix
        >
          ? Suffix
          : 'Store'}`]: () => Store<
          Id extends `${infer RealId}${MapStoresCustomization extends Record<
            'suffix',
            infer Suffix
          >
            ? Suffix
            : 'Store'}`
            ? RealId
            : string,
          State,
          Getters,
          Actions
        >
      }
    : {}

/**
 * For internal use **only**.
 */
export type _Spread<A extends readonly any[]> = A extends [infer L, ...infer R]
  ? _StoreObject<L> & _Spread<R>
  : unknown

export let mapStoreSuffix = 'Store'

/**
 * Changes the suffix added by `mapStores()`. Can be set to an empty string.
 * Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
 * interface if you are using TypeScript.
 *
 * @param suffix - new suffix
 */
export function setMapStoreSuffix(
  suffix: MapStoresCustomization extends Record<'suffix', infer Suffix>
    ? Suffix
    : string // could be 'Store' but that would be annoying for JS
): void {
  mapStoreSuffix = suffix
}

/**
 * Allows using stores without the composition API (`setup()`) by generating an
 * object to be spread in the `computed` field of a component. It accepts a list
 * of store definitions.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapStores(useUserStore, useCartStore)
 *   },
 *
 *   created() {
 *     this.userStore // store with id "user"
 *     this.cartStore // store with id "cart"
 *   }
 * }
 * ```
 *
 * @param stores - list of stores to map to an object
 */
export function mapStores<Stores extends any[]>(
  ...stores: [...Stores]
): _Spread<Stores> {
  if (__DEV__ && Array.isArray(stores[0])) {
    console.warn(
      `[🍍]: Directly pass all stores to "mapStores()" without putting them in an array:\n` +
        `Replace\n` +
        `\tmapStores([useAuthStore, useCartStore])\n` +
        `with\n` +
        `\tmapStores(useAuthStore, useCartStore)\n` +
        `This will fail in production if not fixed.`
    )
    stores = stores[0]
  }

  return stores.reduce((reduced, useStore) => {
    // @ts-expect-error: $id is added by defineStore
    reduced[useStore.$id + mapStoreSuffix] = function (
      this: ComponentPublicInstance
    ) {
      return useStore(this.$pinia)
    }
    return reduced
  }, {} as _Spread<Stores>)
}

/**
 * For internal use **only**
 */
export type _MapStateReturn<
  S extends StateTree,
  G extends _GettersTree<S> | { [key: string]: ComputedRef },
  Keys extends keyof S | keyof G = keyof S | keyof G,
> = {
  // [key in keyof S | keyof G]: () => key extends keyof S
  //   ? S[key]
  //   : key extends keyof G
  //   ? G[key]
  //   : never
  [key in Keys]: key extends keyof Store<string, S, G, {}>
    ? () => Store<string, S, G, {}>[key]
    : never
}

/**
 * For internal use **only**
 */
export type _MapStateObjectReturn<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S> | { [key: string]: ComputedRef },
  A,
  T extends Record<
    string,
    keyof S | keyof G | ((store: Store<Id, S, G, A>) => any)
  > = {},
> = {
  [key in keyof T]: () => T[key] extends (store: any) => infer R
    ? R
    : T[key] extends keyof Store<Id, S, G, A>
      ? Store<Id, S, G, A>[T[key]]
      : never
}

/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component. The values of the object are the state properties/getters
 * while the keys are the names of the resulting computed properties.
 * Optionally, you can also pass a custom function that will receive the store
 * as its first argument. Note that while it has access to the component
 * instance via `this`, it won't be typed.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     // useCounterStore has a state property named `count` and a getter `double`
 *     ...mapState(useCounterStore, {
 *       n: 'count',
 *       triple: store => store.n * 3,
 *       // note we can't use an arrow function if we want to use `this`
 *       custom(store) {
 *         return this.someComponentValue + store.n
 *       },
 *       doubleN: 'double'
 *     })
 *   },
 *
 *   created() {
 *     this.n // 2
 *     this.doubleN // 4
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keyMapper - object of state properties or getters
 */
export function mapState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S> | { [key: string]: ComputedRef },
  A,
  KeyMapper extends Record<
    string,
    keyof S | keyof G | ((store: Store<Id, S, G, A>) => any)
  >,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): _MapStateObjectReturn<Id, S, G, A, KeyMapper>

/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapState(useCounterStore, ['count', 'double'])
 *   },
 *
 *   created() {
 *     this.count // 2
 *     this.double // 4
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keys - array of state properties or getters
 */
export function mapState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S> | { [key: string]: ComputedRef },
  A,
  Keys extends keyof S | keyof G,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: readonly Keys[]
): _MapStateReturn<S, G, Keys>

/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapState<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S> | { [key: string]: ComputedRef },
  A,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: any
): _MapStateReturn<S, G> | _MapStateObjectReturn<Id, S, G, A> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce(
        (reduced, key) => {
          reduced[key] = function (this: ComponentPublicInstance) {
            // @ts-expect-error: FIXME: should work?
            return useStore(this.$pinia)[key]
          } as () => any
          return reduced
        },
        {} as _MapStateReturn<S, G>
      )
    : Object.keys(keysOrMapper).reduce(
        (reduced, key: string) => {
          // @ts-expect-error
          reduced[key] = function (this: ComponentPublicInstance) {
            const store = useStore(this.$pinia)
            const storeKey = keysOrMapper[key]
            // for some reason TS is unable to infer the type of storeKey to be a
            // function
            return typeof storeKey === 'function'
              ? (storeKey as (store: Store<Id, S, G, A>) => any).call(
                  this,
                  store
                )
              : // @ts-expect-error: FIXME: should work?
                store[storeKey]
          }
          return reduced
        },
        {} as _MapStateObjectReturn<Id, S, G, A>
      )
}

/**
 * Alias for `mapState()`. You should use `mapState()` instead.
 * @deprecated use `mapState()` instead.
 */
export const mapGetters = mapState

/**
 * For internal use **only**
 */
export type _MapActionsReturn<A> = {
  [key in keyof A]: A[key]
}

/**
 * For internal use **only**
 */
export type _MapActionsObjectReturn<A, T extends Record<string, keyof A>> = {
  [key in keyof T]: A[T[key]]
}

/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component. The values of the object are the actions while the keys are
 * the names of the resulting methods.
 *
 * @example
 * ```js
 * export default {
 *   methods: {
 *     // other methods properties
 *     // useCounterStore has two actions named `increment` and `setCount`
 *     ...mapActions(useCounterStore, { more: 'increment', setIt: 'setCount' })
 *   },
 *
 *   created() {
 *     this.more()
 *     this.setIt(2)
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keyMapper - object to define new names for the actions
 */
export function mapActions<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof A>,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): _MapActionsObjectReturn<A, KeyMapper>
/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component.
 *
 * @example
 * ```js
 * export default {
 *   methods: {
 *     // other methods properties
 *     ...mapActions(useCounterStore, ['increment', 'setCount'])
 *   },
 *
 *   created() {
 *     this.increment()
 *     this.setCount(2) // pass arguments as usual
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keys - array of action names to map
 */
export function mapActions<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: Array<keyof A>
): _MapActionsReturn<A>
/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapActions<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A,
  KeyMapper extends Record<string, keyof A>,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof A> | KeyMapper
): _MapActionsReturn<A> | _MapActionsObjectReturn<A, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        // @ts-expect-error
        reduced[key] = function (
          this: ComponentPublicInstance,
          ...args: any[]
        ) {
          // @ts-expect-error: FIXME: should work?
          return useStore(this.$pinia)[key](...args)
        }
        return reduced
      }, {} as _MapActionsReturn<A>)
    : Object.keys(keysOrMapper).reduce(
        (reduced, key: keyof KeyMapper) => {
          // @ts-expect-error
          reduced[key] = function (
            this: ComponentPublicInstance,
            ...args: any[]
          ) {
            // @ts-expect-error: FIXME: should work?
            return useStore(this.$pinia)[keysOrMapper[key]](...args)
          }
          return reduced
        },
        {} as _MapActionsObjectReturn<A, KeyMapper>
      )
}

/**
 * For internal use **only**
 */
export type _MapWritableStateKeys<S extends StateTree, G> =
  | keyof UnwrapRef<S>
  | keyof _StoreWithGetters_Writable<G>

/**
 * For internal use **only**
 */
export type _MapWritableStateReturn<
  S extends StateTree,
  G,
  Keys extends _MapWritableStateKeys<S, G>,
> = {
  [key in Keys]: {
    get: () => UnwrapRef<(S & G)[key]>
    set: (value: UnwrapRef<(S & G)[key]>) => any
  }
}

/**
 * For internal use **only**
 */
export type _MapWritableStateObjectReturn<
  S extends StateTree,
  G,
  KeyMapper extends Record<string, _MapWritableStateKeys<S, G>>,
> = {
  [key in keyof KeyMapper]: {
    get: () => UnwrapRef<(S & G)[KeyMapper[key]]>
    set: (value: UnwrapRef<(S & G)[KeyMapper[key]]>) => any
  }
}

/**
 * Same as `mapState()` but creates computed setters as well so the state can be
 * modified. Differently from `mapState()`, only `state` properties can be
 * added.
 *
 * @param useStore - store to map from
 * @param keyMapper - object of state properties
 */
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, _MapWritableStateKeys<S, G>>,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): _MapWritableStateObjectReturn<S, G, KeyMapper>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keys - array of state properties
 */
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  Keys extends _MapWritableStateKeys<S, G>,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: readonly Keys[]
): Pick<_MapWritableStateReturn<S, G, Keys>, Keys>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  Keys extends _MapWritableStateKeys<S, G>,
  KeyArr extends Keys[],
  KeyMapper extends Record<string, Keys>,
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: KeyArr | KeyMapper
):
  | _MapWritableStateReturn<S, G, Keys>
  | _MapWritableStateObjectReturn<S, G, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce(
        (reduced, key) => {
          reduced[key] = {
            get(this: ComponentPublicInstance) {
              return useStore(this.$pinia)[key] as (S & G)[typeof key]
            },
            set(
              this: ComponentPublicInstance,
              value: Store<Id, S, G, A>[typeof key]
            ) {
              return (useStore(this.$pinia)[key] = value)
            },
          }
          return reduced
        },
        {} as _MapWritableStateReturn<S, G, Keys>
      )
    : Object.keys(keysOrMapper).reduce(
        (reduced, key: keyof KeyMapper) => {
          reduced[key] = {
            get(this: ComponentPublicInstance) {
              return useStore(this.$pinia)[keysOrMapper[key]] as (S &
                G)[KeyMapper[typeof key]]
            },
            set(
              this: ComponentPublicInstance,
              value: Store<Id, S, G, A>[KeyMapper[typeof key]]
            ) {
              return (useStore(this.$pinia)[keysOrMapper[key]] = value)
            },
          }
          return reduced
        },
        {} as _MapWritableStateObjectReturn<S, G, KeyMapper>
      )
}
