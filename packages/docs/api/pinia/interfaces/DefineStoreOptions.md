---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / DefineStoreOptions

# Interface: DefineStoreOptions\<Id, S, G, A\>

Options parameter of `defineStore()` for option stores. Can be extended to
augment stores with the plugin API.

## See

[DefineStoreOptionsBase](DefineStoreOptionsBase.md).

## Extends

- [`DefineStoreOptionsBase`](DefineStoreOptionsBase.md)\<`S`, [`Store`](../type-aliases/Store.md)\<`Id`, `S`, `G`, `A`\>\>

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G**

• **A**

## Properties

### actions?

> `optional` **actions**: `A` & `ThisType`\<`A` & `UnwrapRef`\<`S`\> & [`_StoreWithState`](StoreWithState.md)\<`Id`, `S`, `G`, `A`\> & `_StoreWithGetters_Readonly`\<`G`\> & `_StoreWithGetters_Writable`\<`G`\> & [`PiniaCustomProperties`](PiniaCustomProperties.md)\<`string`, [`StateTree`](../type-aliases/StateTree.md), [`_GettersTree`](../type-aliases/GettersTree.md)\<[`StateTree`](../type-aliases/StateTree.md)\>, [`_ActionsTree`](../type-aliases/ActionsTree.md)\>\>

Optional object of actions.

***

### getters?

> `optional` **getters**: `G` & `ThisType`\<`UnwrapRef`\<`S`\> & `_StoreWithGetters_Readonly`\<`G`\> & `_StoreWithGetters_Writable`\<`G`\> & [`PiniaCustomProperties`](PiniaCustomProperties.md)\<`string`, [`StateTree`](../type-aliases/StateTree.md), [`_GettersTree`](../type-aliases/GettersTree.md)\<[`StateTree`](../type-aliases/StateTree.md)\>, [`_ActionsTree`](../type-aliases/ActionsTree.md)\>\> & [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

Optional object of getters.

***

### id

> **id**: `Id`

Unique string key to identify the store across the application.

***

### state()?

> `optional` **state**: () => `S`

Function to create a fresh state. **Must be an arrow function** to ensure
correct typings!

#### Returns

`S`

## Methods

### hydrate()?

> `optional` **hydrate**(`storeState`, `initialState`): `void`

Allows hydrating the store during SSR when complex state (like client side only refs) are used in the store
definition and copying the value from `pinia.state` isn't enough.

#### Parameters

• **storeState**: `UnwrapRef`\<`S`\>

the current state in the store

• **initialState**: `UnwrapRef`\<`S`\>

initialState

#### Returns

`void`

#### Example

If in your `state`, you use any `customRef`s, any `computed`s, or any `ref`s that have a different value on
Server and Client, you need to manually hydrate them. e.g., a custom ref that is stored in the local
storage:

```ts
const useStore = defineStore('main', {
  state: () => ({
    n: useLocalStorage('key', 0)
  }),
  hydrate(storeState, initialState) {
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.n = useLocalStorage('key', 0)
  }
})
```
