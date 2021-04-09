# Introduction

Pinia [started](https://github.com/posva/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e) as an experiment to redesign what a Store for Vue could look like with the [Composition API](https://github.com/vuejs/composition-api) around November 2019. Since then, the initial principles are still the same, but Pinia works for both Vue 2 and Vue 3 **and doesn't require you to use the composition API**. The API is the same for both except for _installation_ and _SSR_, and these docs are targeted to Vue 3 **with notes about Vue 2** whenever necessary so it can be used no matter if you are using Vue 2 or Vue 3!

## Basic example

You start by creating a store:

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'counter',
  state() {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
})
```

And then you _use_ it in a component:

```js
export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
  },
}
```

If you are still not into `setup()` and Composition API, don't worry, Pinia also support a similar set of [_map helpers_ like Vuex](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper). You define stores the same way but then use `mapStores()`, `mapState()`, or `mapActions()`:

```js
const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({ count: 0 }),
  getters: { double: state => state.count * 2 },
  actions: {
    increment() {
      this.count++
    }
  }
})
const useUserStore = defineStore({ id: 'user' })

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

## Why _Pinia_

Pinia (pronounced like `/peenya/` in English) is the closest word to _piña_ (_pineapple_ in Spanish) that is a valid package name. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## A more realistic example

Here is a more complete example of the API you will be using with Pinia **with types even in JavaScript**. For some people this might be enough to get started without reading further but we still recommend checking the rest of the documentation or even skipping this example and coming back once you have read about all of the _Core Concepts_.

```js
import { defineStore } from 'pinia'

export const todos = defineStore({
  id: 'todos',
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos() {
      // autocompletion! ✨
      return this.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos() {
      return this.todos.filter((todo) => !todo.isFinished)
    },
    filteredTodos() {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## Comparison with other
