# HMR (Hot Module Replacement)

Pinia supports Hot Module replacement so you can edit your stores and interact with them directly in your app without reloading the page, allowing you to keep the existing state, add, or even remove state, actions, and getters.

At the moment, only [Vite](https://vitejs.dev/guide/api-hmr.html#hmr-api) is officially supported but any bundler implementing the `import.meta.hot` spec should work (e.g. [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot) seems to use `import.meta.webpackHot` instead of `import.meta.hot`).
You need to add this snippet of code next to any store declaration. Let's say you have three stores: `auth.js`, `chat.js`, and `scroll.js`, you will have to add (and adapt) this after the creation of the _store definition_:

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAuth = defineStore('auth', {
  // options...
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```

You can pass a cleanup function as an optional third argument in order to clean up side effects of the existing store before initializing the new store. This is useful if you have event listeners or other side effects that need to be cleaned up.

```js
// scroll.js
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const useScroll = defineStore('scroll', () => {
  const scrollTop = ref(window.scrollY)

  function onScroll () {
    scrollTop.value = window.scrollY
  }

  function trackScroll () {
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  trackScroll()

  function $cleanUp () {
    window.removeEventListener('scroll', onScroll)
  }

  return {
    scrollTop,
    trackScroll,
    $cleanUp,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useScroll, import.meta.hot, (existingStore) => {
    existingStore.$cleanUp()
  }))
}
```