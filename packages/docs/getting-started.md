## Installation

Install `pinia` with your favorite package manager:

```bash
yarn add pinia@next
# or with npm
npm install pinia@next
```

:::tip
`pinia@next` install Pinia v2 for Vue 3. If your app is using Vue 2, you need to install Pinia v1: `pinia@latest` **and** `@vue/composition-api`. If you are using Nuxt, you should follow [these instructions](/ssr/nuxt).
:::

If you are using the Vue CLI, you can instead give this [**unofficial plugin**](https://github.com/wobsoriano/vue-cli-plugin-pinia) a try.

Create a pinia (the root store) and pass it to the app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

If you are using Vue 2, you also need to install a plugin and inject the created `pinia` at the root of the app:

```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // other options...
  // ...
  // note the same `pinia` instance can be used across multiple Vue apps on
  // the same page
  pinia,
})
```

This will also add devtools support. In Vue 3, some features like time traveling and editing are still not supported because vue-devtools doesn't expose the necessary APIs yet but the devtools have way more features are the developer experience as a whole is far superior. In Vue 2, Pinia uses the existing interface for Vuex (and can therefore not be used alongside it).

## What is a Store?

A Store (like Pinia) is an entity holding state and business logic that isn't bound to your Component tree. In other words, **it hosts global state**. It's a bit like a component that is always there and that everybody can read off and write to. It has **three concepts**, the [state](./core-concepts/state.md), [getters](./core-concepts/getters.md) and [actions](./core-concepts/actions.md) and it's safe to assume these concepts are the equivalent of `data`, `computed` and `methods` in components.

## When should I use a Store

A store should contain data that can be accessed throughout your application. This includes data that is used in many places, e.g. User information that is displayed in the navbar, as well as data that needs to be preserved through pages, e.g. a very complicated multi-step form.

On the other hand, you should avoid including in the store local data that could be hosted in a component instead, e.g. the visibility of an element local to a page.

Not all applications need access to a global state, but if yours need one, Pinia will make your life easier.
