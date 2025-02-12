import type {
  ComputedRef,
  DebuggerEvent,
  Ref,
  UnwrapRef,
  WatchOptions,
  WritableComputedRef,
} from 'vue'
import { Pinia } from './rootStore'

/**
 * Generic state of a Store
 */
export type StateTree = Record<PropertyKey, any>

export function isPlainObject<S extends StateTree>(
  value: S | unknown
): value is S
export function isPlainObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: any
): o is StateTree {
  return (
    o &&
    typeof o === 'object' &&
    Object.prototype.toString.call(o) === '[object Object]' &&
    typeof o.toJSON !== 'function'
  )
}

/**
 * Recursive `Partial<T>`. Used by {@link Store['$patch']}.
 *
 * For internal use **only**
 */
export type _DeepPartial<T> = { [K in keyof T]?: _DeepPartial<T[K]> }
// type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

// TODO: can we change these to numbers?
/**
 * Possible types for SubscriptionCallback
 */
export enum MutationType {
  /**
   * Direct mutation of the state:
   *
   * - `store.name = 'new name'`
   * - `store.$state.name = 'new name'`
   * - `store.list.push('new item')`
   */
  direct = 'direct',

  /**
   * Mutated the state with `$patch` and an object
   *
   * - `store.$patch({ name: 'newName' })`
   */
  patchObject = 'patch object',

  /**
   * Mutated the state with `$patch` and a function
   *
   * - `store.$patch(state => state.name = 'newName')`
   */
  patchFunction = 'patch function',

  // maybe reset? for $state = {} and $reset
}

/**
 * Base type for the context passed to a subscription callback. Internal type.
 */
export interface _SubscriptionCallbackMutationBase {
  /**
   * Type of the mutation.
   */
  type: MutationType

  /**
   * `id` of the store doing the mutation.
   */
  storeId: string

  /**
   * 🔴 DEV ONLY, DO NOT use for production code. Different mutation calls. Comes from
   * https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-debugging and allows to track mutations in
   * devtools and plugins **during development only**.
   */
  events?: DebuggerEvent[] | DebuggerEvent
}

/**
 * Context passed to a subscription callback when directly mutating the state of
 * a store with `store.someState = newValue` or `store.$state.someState =
 * newValue`.
 */
export interface SubscriptionCallbackMutationDirect
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.direct

  events: DebuggerEvent
}

/**
 * Context passed to a subscription callback when `store.$patch()` is called
 * with an object.
 */
export interface SubscriptionCallbackMutationPatchObject<S>
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.patchObject

  events: DebuggerEvent[]

  /**
   * Object passed to `store.$patch()`.
   */
  payload: _DeepPartial<UnwrapRef<S>>
}

/**
 * Context passed to a subscription callback when `store.$patch()` is called
 * with a function.
 */
export interface SubscriptionCallbackMutationPatchFunction
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.patchFunction

  events: DebuggerEvent[]

  /**
   * Object passed to `store.$patch()`.
   */
  // payload: DeepPartial<UnwrapRef<S>>
}

/**
 * Context object passed to a subscription callback.
 */
export type SubscriptionCallbackMutation<S> =
  | SubscriptionCallbackMutationDirect
  | SubscriptionCallbackMutationPatchObject<S>
  | SubscriptionCallbackMutationPatchFunction

/**
 * Callback of a subscription
 */
export type SubscriptionCallback<S> = (
  /**
   * Object with information relative to the store mutation that triggered the
   * subscription.
   */
  mutation: SubscriptionCallbackMutation<S>,

  /**
   * State of the store when the subscription is triggered. Same as
   * `store.$state`.
   */
  state: UnwrapRef<S>
) => void

/**
 * Actual type for {@link StoreOnActionListenerContext}. Exists for refactoring
 * purposes. For internal use only.
 * For internal use **only**
 */
export interface _StoreOnActionListenerContext<
  Store,
  ActionName extends string,
  A,
> {
  /**
   * Name of the action
   */
  name: ActionName

  /**
   * Store that is invoking the action
   */
  store: Store

  /**
   * Parameters passed to the action
   */
  args: A extends Record<ActionName, _Method>
    ? Parameters<A[ActionName]>
    : unknown[]

  /**
   * Sets up a hook once the action is finished. It receives the return value
   * of the action, if it's a Promise, it will be unwrapped.
   */
  after: (
    callback: A extends Record<ActionName, _Method>
      ? (resolvedReturn: Awaited<ReturnType<A[ActionName]>>) => void
      : () => void
  ) => void

  /**
   * Sets up a hook if the action fails. Return `false` to catch the error and
   * stop it from propagating.
   */
  onError: (callback: (error: unknown) => void) => void
}

/**
 * Context object passed to callbacks of `store.$onAction(context => {})`
 * TODO: should have only the Id, the Store and Actions to generate the proper object
 */
export type StoreOnActionListenerContext<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends ActionsTree */,
> = _ActionsTree extends A
  ? _StoreOnActionListenerContext<StoreGeneric, string, _ActionsTree>
  : {
      [Name in keyof A]: Name extends string
        ? _StoreOnActionListenerContext<Store<Id, S, G, A>, Name, A>
        : never
    }[keyof A]

/**
 * Argument of `store.$onAction()`
 */
export type StoreOnActionListener<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends ActionsTree */,
> = (
  context: StoreOnActionListenerContext<
    Id,
    S,
    G,
    // {} creates a type of never due to how StoreOnActionListenerContext is defined
    {} extends A ? _ActionsTree : A
  >
) => void

/**
 * Properties of a store.
 */
export interface StoreProperties<Id extends string> {
  /**
   * Unique identifier of the store
   */
  $id: Id

  /**
   * Private property defining the pinia the store is attached to.
   *
   * @internal
   */
  _p: Pinia

  /**
   * Used by devtools plugin to retrieve getters. Removed in production.
   *
   * @internal
   */
  _getters?: string[]

  /**
   * Used (and added) by devtools plugin to detect Setup vs Options API usage.
   *
   * @internal
   */
  _isOptionsAPI?: boolean

  /**
   * Used by devtools plugin to retrieve properties added with plugins. Removed
   * in production. Can be used by the user to add property keys of the store
   * that should be displayed in devtools.
   */
  _customProperties: Set<string>

  /**
   * Handles a HMR replacement of this store. Dev Only.
   *
   * @internal
   */
  _hotUpdate(useStore: StoreGeneric): void

  /**
   * Allows pausing some of the watching mechanisms while the store is being
   * patched with a newer version.
   *
   * @internal
   */
  _hotUpdating: boolean

  /**
   * Payload of the hmr update. Dev only.
   *
   * @internal
   */
  _hmrPayload: {
    state: string[]
    hotState: Ref<StateTree>
    actions: _ActionsTree
    getters: _ActionsTree
  }
}

/**
 * Base store with state and functions. Should not be used directly.
 */
export interface _StoreWithState<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<StateTree> */,
  A /* extends ActionsTree */,
> extends StoreProperties<Id> {
  /**
   * State of the Store. Setting it will internally call `$patch()` to update the state.
   */
  $state: UnwrapRef<S> & PiniaCustomStateProperties<S>

  /**
   * Applies a state patch to current state. Allows passing nested values
   *
   * @param partialState - patch to apply to the state
   */
  $patch(partialState: _DeepPartial<UnwrapRef<S>>): void

  /**
   * Group multiple changes into one function. Useful when mutating objects like
   * Sets or arrays and applying an object patch isn't practical, e.g. appending
   * to an array. The function passed to `$patch()` **must be synchronous**.
   *
   * @param stateMutator - function that mutates `state`, cannot be asynchronous
   */
  $patch<F extends (state: UnwrapRef<S>) => any>(
    // this prevents the user from using `async` which isn't allowed
    stateMutator: ReturnType<F> extends Promise<any> ? never : F
  ): void

  /**
   * Resets the store to its initial state by building a new state object.
   */
  $reset(): void

  /**
   * Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
   * that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
   * component gets unmounted unless `detached` is set to true.
   *
   * @param callback - callback passed to the watcher
   * @param options - `watch` options + `detached` to detach the subscription from the context (usually a component)
   * this is called from. Note that the `flush` option does not affect calls to `store.$patch()`.
   * @returns function that removes the watcher
   */
  $subscribe(
    callback: SubscriptionCallback<S>,
    options?: { detached?: boolean } & WatchOptions
  ): () => void

  /**
   * Setups a callback to be called every time an action is about to get
   * invoked. The callback receives an object with all the relevant information
   * of the invoked action:
   * - `store`: the store it is invoked on
   * - `name`: The name of the action
   * - `args`: The parameters passed to the action
   *
   * On top of these, it receives two functions that allow setting up a callback
   * once the action finishes or when it fails.
   *
   * It also returns a function to remove the callback. Note than when calling
   * `store.$onAction()` inside of a component, it will be automatically cleaned
   * up when the component gets unmounted unless `detached` is set to true.
   *
   * @example
   *
   *```js
   *store.$onAction(({ after, onError }) => {
   *  // Here you could share variables between all of the hooks as well as
   *  // setting up watchers and clean them up
   *  after((resolvedValue) => {
   *    // can be used to cleanup side effects
   * .  // `resolvedValue` is the value returned by the action, if it's a
   * .  // Promise, it will be the resolved value instead of the Promise
   *  })
   *  onError((error) => {
   *    // can be used to pass up errors
   *  })
   *})
   *```
   *
   * @param callback - callback called before every action
   * @param detached - detach the subscription from the context this is called from
   * @returns function that removes the watcher
   */
  $onAction(
    callback: StoreOnActionListener<Id, S, G, A>,
    detached?: boolean
  ): () => void

  /**
   * Stops the associated effect scope of the store and remove it from the store
   * registry. Plugins can override this method to cleanup any added effects.
   * e.g. devtools plugin stops displaying disposed stores from devtools.
   * Note this doesn't delete the state of the store, you have to do it manually with
   * `delete pinia.state.value[store.$id]` if you want to. If you don't and the
   * store is used again, it will reuse the previous state.
   */
  $dispose(): void
}

/**
 * Generic type for a function that can infer arguments and return type
 *
 * For internal use **only**
 */
export type _Method = (...args: any[]) => any

// export type StoreAction<P extends any[], R> = (...args: P) => R
// export interface StoreAction<P, R> {
//   (...args: P[]): R
// }

// in this type we forget about this because otherwise the type is recursive
/**
 * Store augmented for actions. For internal usage only.
 * For internal use **only**
 */
export type _StoreWithActions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never
}

/**
 * Store augmented with getters. For internal usage only.
 * For internal use **only**
 */
export type _StoreWithGetters<G> = _StoreWithGetters_Readonly<G> &
  _StoreWithGetters_Writable<G>

/**
 * Store augmented with readonly getters. For internal usage **only**.
 */
export type _StoreWithGetters_Readonly<G> = {
  readonly [K in keyof G as G[K] extends (...args: any[]) => any
    ? K
    : ComputedRef extends G[K]
      ? K
      : never]: G[K] extends (...args: any[]) => infer R ? R : UnwrapRef<G[K]>
}

/**
 * Store augmented with writable getters. For internal usage **only**.
 */
export type _StoreWithGetters_Writable<G> = {
  [K in keyof G as G[K] extends WritableComputedRef<any>
    ? K
    : // NOTE: there is still no way to have a different type for a setter and a getter in TS with dynamic keys
      // https://github.com/microsoft/TypeScript/issues/43826
      never]: G[K] extends Readonly<WritableComputedRef<infer R>> ? R : never
}

/**
 * Store type to build a store.
 */
export type Store<
  Id extends string = string,
  S extends StateTree = {},
  G /* extends GettersTree<S>*/ = {},
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = {},
> = _StoreWithState<Id, S, G, A> &
  UnwrapRef<S> &
  _StoreWithGetters<G> &
  // StoreWithActions<A> &
  (_ActionsTree extends A ? {} : A) &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>

/**
 * Generic and type-unsafe version of Store. Doesn't fail on access with
 * strings, making it much easier to write generic functions that do not care
 * about the kind of store that is passed.
 */
export type StoreGeneric = Store<
  string,
  StateTree,
  _GettersTree<StateTree>,
  _ActionsTree
>

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export interface StoreDefinition<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S>*/ = _GettersTree<S>,
  A /* extends ActionsTree */ = _ActionsTree,
> {
  /**
   * Returns a store, creates it if necessary.
   *
   * @param pinia - Pinia instance to retrieve the store
   * @param hot - dev only hot module replacement
   */
  (pinia?: Pinia | null | undefined, hot?: StoreGeneric): Store<Id, S, G, A>

  /**
   * Id of the store. Used by map helpers.
   */
  $id: Id

  /**
   * Dev only pinia for HMR.
   *
   * @internal
   */
  _pinia?: Pinia
}

/**
 * Interface to be extended by the user when they add properties through plugins.
 */
export interface PiniaCustomProperties<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S> */ = _GettersTree<S>,
  A /* extends ActionsTree */ = _ActionsTree,
> {}

/**
 * Properties that are added to every `store.$state` by `pinia.use()`.
 */
export interface PiniaCustomStateProperties<S extends StateTree = StateTree> {}

/**
 * Type of an object of Getters that infers the argument. For internal usage only.
 * For internal use **only**
 */
export type _GettersTree<S extends StateTree> = Record<
  string,
  | ((state: UnwrapRef<S> & UnwrapRef<PiniaCustomStateProperties<S>>) => any)
  | (() => any)
>

/**
 * Type of an object of Actions. For internal usage only.
 * For internal use **only**
 */
export type _ActionsTree = Record<string, _Method>

/**
 * Type that enables refactoring through IDE.
 * For internal use **only**
 */
export type _ExtractStateFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends _Method | ComputedRef ? never : K]: any
}

/**
 * Type that enables refactoring through IDE.
 * For internal use **only**
 */
export type _ExtractActionsFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends _Method ? K : never]: any
}

/**
 * Type that enables refactoring through IDE.
 * For internal use **only**
 */
export type _ExtractGettersFromSetupStore_Keys<SS> = keyof {
  [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any
}

/**
 * Type that enables refactoring through IDE.
 * For internal use **only**
 */
export type _UnwrapAll<SS> = { [K in keyof SS]: UnwrapRef<SS[K]> }

/**
 * For internal use **only**
 */
export type _ExtractStateFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : Pick<SS, _ExtractStateFromSetupStore_Keys<SS>>

/**
 * For internal use **only**
 */
export type _ExtractActionsFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : Pick<SS, _ExtractActionsFromSetupStore_Keys<SS>>

/**
 * For internal use **only**
 */
export type _ExtractGettersFromSetupStore<SS> = SS extends undefined | void
  ? {}
  : Pick<SS, _ExtractGettersFromSetupStore_Keys<SS>>

/**
 * Options passed to `defineStore()` that are common between option and setup
 * stores. Extend this interface if you want to add custom options to both kinds
 * of stores.
 */
export interface DefineStoreOptionsBase<S extends StateTree, Store> {}

/**
 * Options parameter of `defineStore()` for option stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineStoreOptions<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends Record<string, StoreAction> */,
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  /**
   * Unique string key to identify the store across the application.
   */
  id: Id

  /**
   * Function to create a fresh state. **Must be an arrow function** to ensure
   * correct typings!
   */
  state?: () => S

  /**
   * Optional object of getters.
   */
  getters?: G &
    ThisType<UnwrapRef<S> & _StoreWithGetters<G> & PiniaCustomProperties> &
    _GettersTree<S>

  /**
   * Optional object of actions.
   */
  actions?: A &
    ThisType<
      A &
        UnwrapRef<S> &
        _StoreWithState<Id, S, G, A> &
        _StoreWithGetters<G> &
        PiniaCustomProperties
    >

  /**
   * Allows hydrating the store during SSR when complex state (like client side only refs) are used in the store
   * definition and copying the value from `pinia.state` isn't enough.
   *
   * @example
   * If in your `state`, you use any `customRef`s, any `computed`s, or any `ref`s that have a different value on
   * Server and Client, you need to manually hydrate them. e.g., a custom ref that is stored in the local
   * storage:
   *
   * ```ts
   * const useStore = defineStore('main', {
   *   state: () => ({
   *     n: useLocalStorage('key', 0)
   *   }),
   *   hydrate(storeState, initialState) {
   *     // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
   *     storeState.n = useLocalStorage('key', 0)
   *   }
   * })
   * ```
   *
   * @param storeState - the current state in the store
   * @param initialState - initialState
   */
  hydrate?(storeState: UnwrapRef<S>, initialState: UnwrapRef<S>): void
}

/**
 * Options parameter of `defineStore()` for setup stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineSetupStoreOptions<
  Id extends string,
  // NOTE: Passing SS seems to make TS crash
  S extends StateTree,
  G,
  A /* extends ActionsTree */,
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  /**
   * Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
   * creating the store. Can be used in plugins to get the list of actions in a
   * store defined with a setup function. Note this is always defined
   */
  actions?: A
}

/**
 * Available `options` when creating a pinia plugin.
 */
export interface DefineStoreOptionsInPlugin<
  Id extends string,
  S extends StateTree,
  G,
  A,
> extends Omit<DefineStoreOptions<Id, S, G, A>, 'id' | 'actions'> {
  /**
   * Extracted object of actions. Added by useStore() when the store is built
   * using the setup API, otherwise uses the one passed to `defineStore()`.
   * Defaults to an empty object if no actions are defined.
   */
  actions: A
}

/**
 * Utility type. For internal use **only**
 */
export interface _Empty {}

/**
 * Merges type objects for better readability in the code.
 * Utility type. For internal use **only**
 */
export type _Simplify<T> = _Empty extends T
  ? _Empty
  : { [key in keyof T]: T[key] } & {}
