import { Ref } from 'vue'

export type StateTree = Record<string | number | symbol, any>

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

export type NonNullObject = Record<any, any>

export interface StoreGetter<S extends StateTree, T = any> {
  (state: S, getters: Record<string, Ref<any>>): T
}

export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
// type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

export type SubscriptionCallback<S> = (
  mutation: { storeName: string; type: string; payload: DeepPartial<S> },
  state: S
) => void

export interface StoreWithState<Id extends string, S extends StateTree> {
  /**
   * Unique identifier of the store
   */
  $id: Id

  /**
   * State of the Store. Setting it will replace the whole state.
   */
  $state: S

  /**
   * Private property defining the request key for this store
   *
   * @internal
   */
  _r: NonNullObject

  /**
   * Applies a state patch to current state. Allows passing nested values
   *
   * @param partialState - patch to apply to the state
   */
  $patch(partialState: DeepPartial<S>): void

  /**
   * Resets the store to its initial state by removing all subscriptions and
   * building a new state object
   */
  $reset(): void

  /**
   * Setups a callback to be called whenever the state changes.
   *
   * @param callback - callback passed to the watcher
   * @returns function that removes the watcher
   */
  $subscribe(callback: SubscriptionCallback<S>): () => void
}

export type Method = (...args: any[]) => any

// export type StoreAction<P extends any[], R> = (...args: P) => R
// export interface StoreAction<P, R> {
//   (...args: P[]): R
// }

// in this type we forget about this because otherwise the type is recursive
export type StoreWithActions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never
}

// export interface StoreGetter<S extends StateTree, T = any> {
//   // TODO: would be nice to be able to define the getters here
//   (state: S, getters: Record<string, Ref<any>>): T
// }

export type StoreWithGetters<G> = {
  [k in keyof G]: G[k] extends (this: infer This, store?: any) => infer R
    ? R
    : never
}

// // in this type we forget about this because otherwise the type is recursive
// export type StoreWithThisGetters<G> = {
//   // TODO: does the infer this as the second argument work?
//   [k in keyof G]: G[k] extends (this: infer This, store?: any) => infer R
//     ? (this: This, store?: This) => R
//     : never
// }

// has the actions without the context (this) for typings
export type Store<
  Id extends string,
  S extends StateTree,
  G,
  A
> = StoreWithState<Id, S> & S & StoreWithGetters<G> & StoreWithActions<A>

export type GenericStore = Store<
  string,
  StateTree,
  Record<string, Method>,
  Record<string, Method>
>
