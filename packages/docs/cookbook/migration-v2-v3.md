# Migrating from v2 to v3

Pinia v3 is a _boring_ major release with no new features. It drops deprecated APIs and updates major dependencies. It only supports Vue 3. If you are using Vue 2, you can keep using v2. If you need help, [book help with Pinia's author](https://cal.com/posva/consultancy).

For most users, the migration should require **no change**. This guide is here to help you in case you encounter any issues.

## Deprecations

### `defineStore({ id })`

The `defineStore()` signature that accepts an object with an `id` property is deprecated. You should use the `id` parameter instead:

```ts
defineStore({ // [!code --]
  id: 'storeName', // [!code --]
defineStore('storeName', { // [!code ++]
  // ...
})
```

### `PiniaStorePlugin`

This deprecated type alias has been removed in favor of `PiniaPlugin`.

## New versions

- Only Vue 3 is supported.
- TypeScript 5 or newer is required.
- The devtools API has been upgraded to [v7](https://devtools.vuejs.org).

## Nuxt

The Nuxt module has been updated to support Nuxt 3. If you are using Nuxt 2 or Nuxt bridge, you can keep using the old version of Pinia.
