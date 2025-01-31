# Using a store outside of a component

<MasteringPiniaLink
  href="https://play.gumlet.io/embed/651ed1ec4c2f339c6860fd06"
  mp-link="https://masteringpinia.com/lessons/how-does-usestore-work"
  title="Using stores outside of components"
/>

Pinia stores rely on the `pinia` instance to share the same store instance across all calls. Most of the time, this works out of the box by just calling your `useStore()` function. For example, in `setup()`, you don't need to do anything else. But things are a bit different outside of a component.
Behind the scenes, `useStore()` _injects_ the `pinia` instance you gave to your `app`. This means that if the `pinia` instance cannot be automatically injected, you have to manually provide it to the `useStore()` function.
You can solve this differently depending on the kind of application you are writing.

## Single Page Applications

If you are not doing any SSR (Server Side Rendering), any call of `useStore()` after installing the pinia plugin with `app.use(pinia)` will work:

```js
import { useUserStore } from '@/stores/user'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  fails because it's called before the pinia is created
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ works because the pinia instance is now active
const userStore = useUserStore()
```

The easiest way to ensure this is always applied is to _defer_ calls of `useStore()` by placing them inside functions that will always run after pinia is installed.

Let's take a look at this example of using a store inside of a navigation guard with Vue Router:

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on the order of imports this will fail
const store = useUserStore()

router.beforeEach((to, from, next) => {
  // we wanted to use the store here
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## SSR Apps

When dealing with Server Side Rendering, you will have to pass the `pinia` instance to `useStore()`. This prevents pinia from sharing global state between different application instances.

There is a whole section dedicated to it in the [SSR guide](/ssr/index.md), this is just a short explanation.
