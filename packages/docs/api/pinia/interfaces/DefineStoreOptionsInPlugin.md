---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / DefineStoreOptionsInPlugin

# Interface: DefineStoreOptionsInPlugin\<Id, S, G, A\>

Available `options` when creating a pinia plugin.

## Extends

- `Omit`\<[`DefineStoreOptions`](DefineStoreOptions.md)\<`Id`, `S`, `G`, `A`\>, `"id"` \| `"actions"`\>

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G**

• **A**

## Properties

### actions

> **actions**: `A`

Extracted object of actions. Added by useStore() when the store is built
using the setup API, otherwise uses the one passed to `defineStore()`.
Defaults to an empty object if no actions are defined.

***

### getters?

> `optional` **getters**: `G` & `ThisType`\<`UnwrapRef`\<`S`\> & `_StoreWithGetters_Readonly`\<`G`\> & `_StoreWithGetters_Writable`\<`G`\> & [`PiniaCustomProperties`](PiniaCustomProperties.md)\<`string`, [`StateTree`](../type-aliases/StateTree.md), [`_GettersTree`](../type-aliases/GettersTree.md)\<[`StateTree`](../type-aliases/StateTree.md)\>, [`_ActionsTree`](../type-aliases/ActionsTree.md)\>\> & [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

Optional object of getters.

#### Inherited from

`Omit.getters`

***

### state()?

> `optional` **state**: () => `S`

Function to create a fresh state. **Must be an arrow function** to ensure
correct typings!

#### Returns

`S`

#### Inherited from

`Omit.state`

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

#### Inherited from

`Omit.hydrate`
