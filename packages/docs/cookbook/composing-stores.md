# Composing Stores

Composing stores is about having stores that use each other, and this is supported in Pinia. There is one rule to follow:

If **two or more stores use each other**, they cannot create an infinite loop through _getters_ or _actions_. They cannot **both** directly read each other state in their setup function:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ This is not possible because y also tries to read x.name
  y.name

  function doSomething() {
    // ✅ Read y properties in computed or actions
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ This is not possible because x also tries to read y.name
  x.name

  function doSomething() {
    // ✅ Read x properties in computed or actions
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Nested Stores

Note that if one store uses another store, you can directly import and call the `useStore()` function within _actions_ and _getters_. Then you can interact with the store just like you would from within a Vue component. See [Shared Getters](#Shared-Getters) and [Shared Actions](#Shared-Actions).

When it comes to _setup stores_, you can simply use one of the stores **at the top** of the store function:

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiPurchase } from './api'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `Hi ${user.name}, you have ${list.value.length} items in your cart. It costs ${price.value}.`
  })

  function purchase() {
    return apiPurchase(user.id, list.value)
  }

  return { summary, purchase }
})
```

## Shared Getters

You can simply call `useUserStore()` inside a _getter_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

## Shared Actions

The same applies to _actions_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiOrderCart } from './api'
 
export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // another action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

Since actions can be asynchronous, make sure **all of your `useStore()` calls appear before any `await`**. Otherwise, this could lead to using the wrong pinia instance _in SSR apps_:

```js{7-8,11-13}
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiOrderCart } from './api'
  
export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      // ✅ call at the top of the action before any `await`
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // ❌ called after an `await` statement
        const otherStore = useOtherStore()
        // another action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
