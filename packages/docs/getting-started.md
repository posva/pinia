# Getting Started

## Installation

<VueMasteryLogoLink for="pinia-cheat-sheet">
</VueMasteryLogoLink>

Install `pinia` with your favorite package manager:

```bash
yarn add pinia
# or with npm
npm install pinia
```

:::tip
If your app is using Vue <2.7, you also need to install the composition api: `@vue/composition-api`. If you are using Nuxt, you should follow [these instructions](/ssr/nuxt.md).
:::

If you are using the Vue CLI, you can instead give this [**unofficial plugin**](https://github.com/wobsoriano/vue-cli-plugin-pinia) a try.

Create a pinia instance (the root store) and pass it to the app as a plugin:

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## What is a Store?

A Store (like Pinia) is an entity holding state and business logic that isn't bound to your Component tree. In other words, **it hosts global state**. It's a bit like a component that is always there and that everybody can read off and write to. It has **three concepts**, the [state](./core-concepts/state.md), [getters](./core-concepts/getters.md) and [actions](./core-concepts/actions.md) and it's safe to assume these concepts are the equivalent of `data`, `computed` and `methods` in components.

## When should I use a Store

A store should contain data that can be accessed throughout your application. This includes data that is used in many places, e.g. User information that is displayed in the navbar, as well as data that needs to be preserved through pages, e.g. a very complicated multi-step form.

On the other hand, you should avoid including in the store local data that could be hosted in a component instead, e.g. the visibility of an element local to a page.

Not all applications need access to a global state, but if yours need one, Pinia will make your life easier.

## When should I **not** use a Store

Sometimes we end up using a store for too many things. If you feel like your application is over using stores, you might want to re consider the purposes of your stores. Namely, if some of their logic should just be composables or if some of their state should be local to a component. This is covered in depth in the [(Not) Overusing stores](https://masteringpinia.com/lessons/not-overusing-stores) lesson of Mastering Pinia.
