# Dealing with Composables

[Composables](https://vuejs.org/guide/reusability/composables.html#composables) are functions that leverage Vue Composition API to encapsulate and reuse stateful logic. Whether you write your own, you use [external libraries](https://vueuse.org/) or do both, you can fully use the power of Composables in your pinia stores.

## Option Stores

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/using-composables-in-option-stores"
  title="Using Composables in Option Stores"
/>

When defining an option store, you can call a composable inside of the `state` property:

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

Keep in mind that **you can only return writable state** (e.g. a `ref()`). Here are some examples of composables that you can use:

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

Here are some examples of composables that cannot be used in an option stores (but can be used with setup stores):

- [useMediaControls](https://vueuse.org/core/useMediaControls/): exposes functions
- [useMemoryInfo](https://vueuse.org/core/useMemory/): exposes readonly data
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): exposes readonly data and functions

## Setup Stores

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/using-composables-in-setup-stores"
  title="Using Composables in Setup Stores"
/>

On the other hand, when defining a setup store, you can use almost any composable since every property gets discerned into state, action, or getter:

```ts
import { defineStore } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // we won't expose (return) this element directly
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/data/video.mp4')
  const { playing, volume, currentTime, togglePictureInPicture } =
    useMediaControls(videoElement, { src })

  function loadVideo(element: HTMLVideoElement, src: string) {
    videoElement.value = element
    src.value = src
  }

  return {
    src,
    playing,
    volume,
    currentTime,

    loadVideo,
    togglePictureInPicture,
  }
})
```

:::warning
Differently from regular state, `ref<HTMLVideoElement>()` contains a non-serializable reference to the DOM element. This is why we don't return it directly. Since it's client-only state, we know it won't be set on the server and will **always** start as `undefined` on the client.
:::

## SSR

When dealing with [Server Side Rendering](../ssr/index.md), you need to take care of some extra steps in order to use composables within your stores.

In [Option Stores](#option-stores), you need to define a `hydrate()` function. This function is called when the store is instantiated on the client (the browser) when there is an initial state available at the time the store is created. The reason we need to define this function is because in such scenario, `state()` is not called.

```ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // in this case we can completely ignore the initial state since we
    // want to read the value from the browser
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

In [Setup Stores](#setup-stores), you need to use a helper named `skipHydrate()` on any state property that shouldn't be picked up from the initial state. Differently from option stores, setup stores cannot just _skip calling `state()`_, so we mark properties that cannot be hydrated with `skipHydrate()`. Note that this only applies to state properties:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

export const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)
  // ...
  return {
    lastColor: skipHydrate(lastColor), // Ref<string>
    open, // Function
    isSupported, // boolean (not even reactive)
  }
})
```
