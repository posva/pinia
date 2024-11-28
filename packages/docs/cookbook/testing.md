# Testing stores

<MasteringPiniaLink
  href="https://play.gumlet.io/embed/65f9a9c10bfab01f414c25dc"
  title="Watch a free video of Mastering Pinia about testing stores"
/>

Stores will, by design, be used at many places and can make testing much harder than it should be. Fortunately, this doesn't have to be the case. We need to take care of three things when testing stores:

- The `pinia` instance: Stores cannot work without it
- `actions`: most of the time, they contain the most complex logic of our stores. Wouldn't it be nice if they were mocked by default?
- Plugins: If you rely on plugins, you will have to install them for tests too

Depending on what or how you are testing, we need to take care of these three things differently.

## Unit testing a store

To unit test a store, the most important part is creating a `pinia` instance:

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounterStore()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounterStore()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```

If you have any store plugins, there is one important thing to know: **plugins won't be used until `pinia` is installed in an App**. This can be solved by creating an empty App or a fake one:

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// same code as above...

// you don't need to create one app per test
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## Unit testing components

<!-- NOTE: too long maybe but good value -->
<!-- <MasteringPiniaLink
  href="https://play.gumlet.io/embed/6630f540c418f8419b73b2b2?t1=1715867840&t2=1715867570609?preload=false&autoplay=false&loop=false&disable_player_controls=false"
  title="Watch a free video of Mastering Pinia about testing stores"
/> -->

This can be achieved with `createTestingPinia()`, which returns a pinia instance designed to help unit tests components.

Start by installing `@pinia/testing`:

```shell
npm i -D @pinia/testing
```

And make sure to create a testing pinia in your tests when mounting a component:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// import any store you want to interact with in tests
import { useSomeStore } from '@/stores/myStore'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // uses the testing pinia!

// state can be directly manipulated
store.name = 'my new name'
// can also be done through patch
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// actions are stubbed by default, meaning they don't execute their code by default.
// See below to customize this behavior.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

Please note that if you are using Vue 2, `@vue/test-utils` requires a [slightly different configuration](#Unit-test-components-Vue-2-).

### Initial State

You can set the initial state of **all of your stores** when creating a testing pinia by passing an `initialState` object. This object will be used by the testing pinia to _patch_ stores when they are created. Let's say you want to initialize the state of this store:

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

Since the store is named _"counter"_, you need to add a matching object to `initialState`:

```ts
// somewhere in your test
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, // start the counter at 20 instead of 0
        },
      }),
    ],
  },
})

const store = useSomeStore() // uses the testing pinia!
store.n // 20
```

### Customizing behavior of actions

`createTestingPinia` stubs out all store actions unless told otherwise. This allows you to test your components and stores separately.

If you want to revert this behavior and normally execute your actions during tests, specify `stubActions: false` when calling `createTestingPinia`:

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// Now this call WILL execute the implementation defined by the store
store.someAction()

// ...but it's still wrapped with a spy, so you can inspect calls
expect(store.someAction).toHaveBeenCalledTimes(1)
```

### Mocking the returned value of an action

Actions are automatically spied but type-wise, they are still the regular actions. In order to get the correct type, we must implement a custom type-wrapper that applies the `Mock` type to each action. **This type depends on the testing framework you are using**. Here is an example with Vitest:

```ts
import type { Mock } from 'vitest'
import type { UnwrapRef } from 'vue'
import type { Store, StoreDefinition } from 'pinia'

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef
): TStoreDef extends StoreDefinition<
  infer Id,
  infer State,
  infer Getters,
  infer Actions
>
  ? Store<
      Id,
      State,
      Record<string, never>,
      {
        [K in keyof Actions]: Actions[K] extends (...args: any[]) => any
          ? // 👇 depends on your testing framework
            Mock<Actions[K]>
          : Actions[K]
      }
    > & {
      [K in keyof Getters]: UnwrapRef<Getters[K]>
    }
  : ReturnType<TStoreDef> {
  return useStore() as any
}
```

This can be used in tests to get a correctly typed store:

```ts
import { mockedStore } from './mockedStore'
import { useSomeStore } from '@/stores/myStore'

const store = mockedStore(useSomeStore)
// typed!
store.someAction.mockResolvedValue('some value')
```

If you are interesting in learning more tricks like this, you should check out the Testing lessons on [Mastering Pinia](https://masteringpinia.com/lessons/exercise-mocking-stores-introduction).

### Specifying the createSpy function

When using Jest, or vitest with `globals: true`, `createTestingPinia` automatically stubs actions using the spy function based on the existing test framework (`jest.fn` or `vitest.fn`). If you are not using `globals: true` or using a different framework, you'll need to provide a [createSpy](../api/@pinia/testing/interfaces/TestingOptions.html#createSpy-) option:

::: code-group

```ts [vitest]
// NOTE: not needed with `globals: true`
import { vi } from 'vitest'

createTestingPinia({
  createSpy: vi.fn,
})
```

```ts [sinon]
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy,
})
```

:::

You can find more examples in [the tests of the testing package](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts).

### Mocking getters

By default, any getter will be computed like regular usage but you can manually force a value by setting the getter to anything you want:

```ts
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 1 }),
  getters: {
    double: (state) => state.n * 2,
  },
})

const pinia = createTestingPinia()
const counter = useCounterStore(pinia)

counter.double = 3 // 🪄 getters are writable only in tests

// set to undefined to reset the default behavior
// @ts-expect-error: usually it's a number
counter.double = undefined
counter.double // 2 (=1 x 2)
```

### Pinia Plugins

If you have any pinia plugins, make sure to pass them when calling `createTestingPinia()` so they are properly applied. **Do not add them with `testingPinia.use(MyPlugin)`** like you would do with a regular pinia:

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '../src/stores/plugin'

// inside some test
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        stubActions: false,
        plugins: [somePlugin],
      }),
    ],
  },
})
```

## E2E tests

When it comes to Pinia, you don't need to change anything for E2E tests, that's the whole point of these tests! You could maybe test HTTP requests, but that's way beyond the scope of this guide 😄.

## Unit test components (Vue 2)

When using [Vue Test Utils 1](https://v1.test-utils.vuejs.org/), install Pinia on a `localVue`:

```js
import { PiniaVuePlugin } from 'pinia'
import { createLocalVue, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const localVue = createLocalVue()
localVue.use(PiniaVuePlugin)

const wrapper = mount(Counter, {
  localVue,
  pinia: createTestingPinia(),
})

const store = useSomeStore() // uses the testing pinia!
```
