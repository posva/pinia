import { acceptHMRUpdate, defineStore } from 'pinia'
import { getRandomJoke, Joke } from '../api/jokes'
import { usePromise } from 'vue-promised'
import { ref, watch } from 'vue'

export const useJokes = defineStore('jokes-vue-promised', {
  state: () => {
    const promise = ref(getRandomJoke())

    watch(promise, () => {
      console.log('promise changed')
    })

    const promised = usePromise(promise)

    return {
      promise,
      ...promised,
      history: [] as Joke[],
    }
  },

  actions: {
    waitForJoke() {
      return this.promise
    },

    fetchJoke() {
      if (
        this.data &&
        // if the request below fails, avoid adding it twice
        !this.history.includes(this.data)
      ) {
        this.history.push(this.data)
      }

      console.log('fetching')
      // this.$state.promise = getRandomJoke()
      // Will fail because we initially had a ref
      this.promise = getRandomJoke()

      return this.$state.promise
    },
  },
})

export const useSetupJokes = defineStore('jokes-setup-vue-promised', () => {
  const history = ref<Joke[]>([])
  const promise = ref(getRandomJoke())
  watch(promise, () => {
    console.log('promise changed')
  })

  const promised = usePromise(promise)

  function fetchJoke() {
    if (
      promised.data.value &&
      // if the request below fails, avoid adding it twice
      !history.value.includes(promised.data.value)
    ) {
      history.value.push(promised.data.value)
    }

    console.log('fetching')
    // this.$state.promise = getRandomJoke()
    // Will fail because we initially had a ref
    promise.value = getRandomJoke()

    promise.value.then((joke) => {
      console.log('got', joke)
    })

    return promise.value
  }

  return {
    promise,
    ...promised,
    history,
    fetchJoke,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJokes, import.meta.hot))
  // import.meta.hot.accept(acceptHMRUpdate(useSetupJokes, import.meta.hot))
}
