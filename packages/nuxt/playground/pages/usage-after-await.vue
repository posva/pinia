<script lang="ts" setup>
const useFancyCounter = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))

  // ❌ bad usage: the use of a store after an await could lead to using the wrong pinia instance.
  return useCounter()
}

const event = useRequestEvent()
useNuxtApp().hook('vue:error', (error) => {
  if (event) {
    setResponseStatus(event, 500, String(error))
  }
})

const counter = await useFancyCounter()
</script>

<template>
  <div>
    <p>Count: {{ counter.$state.count }}</p>
    <button @click="counter.increment()">+</button>
  </div>
</template>
