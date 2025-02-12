# Plugins

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/What-is-a-pinia-plugin"
  title="Learn all about Pinia plugins"
/>

Pinia stores can be fully extended thanks to a low level API. Here is a list of things you can do:

- Add new properties to stores
- Add new options when defining stores
- Add new methods to stores
- Wrap existing methods
- Intercept actions and its results
- Implement side effects like [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- Apply **only** to specific stores

Plugins are added to the pinia instance with `pinia.use()`. The simplest example is adding a static property to all stores by returning an object:

```js
import { createPinia } from 'pinia'

// add a property named `secret` to every store that is created
// after this plugin is installed this could be in a different file
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// give the plugin to pinia
pinia.use(SecretPiniaPlugin)

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```

This is useful to add global objects like the router, modal, or toast managers.

## Introduction

A Pinia plugin is a function that optionally returns properties to be added to a store. It takes one optional argument, a _context_:

```js
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()`
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

This function is then passed to `pinia` with `pinia.use()`:

```js
pinia.use(myPiniaPlugin)
```

Plugins are only applied to stores created **after the plugins themselves, and after `pinia` is passed to the app**, otherwise they won't be applied.

## Augmenting a Store

You can add properties to every store by simply returning an object of them in a plugin:

```js
pinia.use(() => ({ hello: 'world' }))
```

You can also set the property directly on the `store` but **if possible use the return version so they can be automatically tracked by devtools**:

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

Any property _returned_ by a plugin will be automatically tracked by devtools so in order to make `hello` visible in devtools, make sure to add it to `store._customProperties` **in dev mode only** if you want to debug it in devtools:

```js
// from the example above
pinia.use(({ store }) => {
  store.hello = 'world'
  // make sure your bundler handles this. webpack and vite should do it by default
  if (process.env.NODE_ENV === 'development') {
    // add any keys you set on the store
    store._customProperties.add('hello')
  }
})
```

Note that every store is wrapped with [`reactive`](https://vuejs.org/api/reactivity-core#reactive), automatically unwrapping any Ref (`ref()`, `computed()`, ...) it contains:

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // each store has its individual `hello` property
  store.hello = ref('secret')
  // it gets automatically unwrapped
  store.hello // 'secret'

  // all stores are sharing the value `shared` property
  store.shared = sharedRef
  store.shared // 'shared'
})
```

This is why you can access all computed properties without `.value` and why they are reactive.

### Adding new state

If you want to add new state properties to a store or properties that are meant to be used during hydration, **you will have to add it in two places**:

- On the `store` so you can access it with `store.myState`
- On `store.$state` so it can be used in devtools and **be serialized during SSR**.

On top of that, you will certainly have to use a `ref()` (or other reactive API) in order to share the value across different accesses:

```js
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // to correctly handle SSR, we need to make sure we are not overriding an
  // existing value
  if (!store.$state.hasOwnProperty('hasError')) {
    // hasError is defined within the plugin, so each store has their individual
    // state property
    const hasError = ref(false)
    // setting the variable on `$state`, allows it be serialized during SSR
    store.$state.hasError = hasError
  }
  // we need to transfer the ref from the state to the store, this way
  // both accesses: store.hasError and store.$state.hasError will work
  // and share the same variable
  // See https://vuejs.org/api/reactivity-utilities.html#toref
  store.hasError = toRef(store.$state, 'hasError')

  // in this case it's better not to return `hasError` since it
  // will be displayed in the `state` section in the devtools
  // anyway and if we return it, devtools will display it twice.
})
```

Note that state changes or additions that occur within a plugin (that includes calling `store.$patch()`) happen before the store is active and therefore **do not trigger any subscriptions**.

#### Resetting state added in plugins

By default, `$reset()` will not reset state added by plugins but you can override it to also reset the state you add:

```js
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // this is the same code as above for reference
  if (!store.$state.hasOwnProperty('hasError')) {
    const hasError = ref(false)
    store.$state.hasError = hasError
  }
  store.hasError = toRef(store.$state, 'hasError')

  // make sure to set the context (`this`) to the store
  const originalReset = store.$reset.bind(store)

  // override the $reset function
  return {
    $reset() {
      originalReset()
      store.hasError = false
    },
  }
})
```

## Adding new external properties

When adding external properties, class instances that come from other libraries, or simply things that are not reactive, you should wrap the object with `markRaw()` before passing it to pinia. Here is an example adding the router to every store:

```js
import { markRaw } from 'vue'
// adapt this based on where your router is
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## Calling `$subscribe` inside plugins

You can use [store.$subscribe](./state.md#Subscribing-to-the-state) and [store.$onAction](./actions.md#Subscribing-to-actions) inside plugins too:

```ts
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // react to store changes
  })
  store.$onAction(() => {
    // react to store actions
  })
})
```

## Adding new options

It is possible to create new options when defining stores to later on consume them from plugins. For example, you could create a `debounce` option that allows you to debounce any action:

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // this will be read by a plugin later on
  debounce: {
    // debounce the action searchContacts by 300ms
    searchContacts: 300,
  },
})
```

The plugin can then read that option to wrap actions and replace the original ones:

```js
// use any debounce library
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // we are overriding the actions with new ones
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

Note that custom options are passed as the 3rd argument when using the setup syntax:

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // this will be read by a plugin later on
    debounce: {
      // debounce the action searchContacts by 300ms
      searchContacts: 300,
    },
  }
)
```

## TypeScript

Everything shown above can be done with typing support, so you don't ever need to use `any` or `@ts-ignore`.

### Typing plugins

A Pinia plugin can be typed as follows:

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### Typing new store properties

When adding new properties to stores, you should also extend the `PiniaCustomProperties` interface.

```ts
import 'pinia'
import type { Router } from 'vue-router'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // by using a setter we can allow both strings and refs
    set hello(value: string | Ref<string>)
    get hello(): string

    // you can define simpler values too
    simpleNumber: number

    // type the router added by the plugin above (#adding-new-external-properties)
    router: Router
  }
}
```

It can then be written and read safely:

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.simpleNumber = Math.random()
  // @ts-expect-error: we haven't typed this correctly
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties` is a generic type that allows you to reference properties of a store. Imagine the following example where we copy over the initial options as `$options` (this would only work for option stores):

```ts
pinia.use(({ options }) => ({ $options: options }))
```

We can properly type this by using the 4 generic types of `PiniaCustomProperties`:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

:::tip
When extending types in generics, they must be named **exactly as in the source code**. `Id` cannot be named `id` or `I`, and `S` cannot be named `State`. Here is what every letter stands for:

- S: State
- G: Getters
- A: Actions
- SS: Setup Store / Store

:::

### Typing new state

When adding new state properties (to both, the `store` and `store.$state`), you need to add the type to `PiniaCustomStateProperties` instead. Differently from `PiniaCustomProperties`, it only receives the `State` generic:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### Typing new creation options

When creating new options for `defineStore()`, you should extend the `DefineStoreOptionsBase`. Differently from `PiniaCustomProperties`, it only exposes two generics: the State and the Store type, allowing you to limit what can be defined. For example, you can use the names of the actions:

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

:::tip

There is also a `StoreGetters` type to extract the _getters_ from a Store type. You can also extend the options of _setup stores_ or _option stores_ **only** by extending the types `DefineStoreOptions` and `DefineSetupStoreOptions` respectively.

:::

## Nuxt

When [using pinia alongside Nuxt](../ssr/nuxt.md), you will have to create a [Nuxt plugin](https://nuxt.com/docs/guide/directory-structure/plugins) first. This will give you access to the `pinia` instance:

```ts{14-16}
// plugins/myPiniaPlugin.ts
import { PiniaPluginContext } from 'pinia'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // react to store changes
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // Note this has to be typed if you are using TS
  return { creationTime: new Date() }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
})
```

::: info

The above example is using TypeScript, you have to remove the type annotations `PiniaPluginContext` and `Plugin` as well as their imports if you are using a `.js` file.

:::

## Existing plugins

You can check existing [Pinia plugins on GitHub](https://github.com/topics/pinia-plugin) with the topic _pinia-plugin_.
