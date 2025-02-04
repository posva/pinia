<template>
  <p>
    I have a store "{{ userStore.name }}". I have
    {{ cartStore.items.length }} items in the cart.
  </p>
  <div>
    <p>Counter: {{ counterStore.double }} = 2 x {{ counterStore.n }}</p>
    <button @click="counterStore.increment(10)">Increment</button>
    <button @click="counterStore.fail()">Fail</button>
    <button @click="counterStore.decrementToZero(300)">Countdown!</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useCounter } from '../stores/counter'
import { onUnmounted } from 'vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const counterStore = useCounter()

onUnmounted(() => {
  userStore.$dispose()
  cartStore.$dispose()
  counterStore.$dispose()
})
</script>
