<script lang="ts" setup>
const store = useWithNullObjectStore()
</script>

<template>
  <h2>null object</h2>
  <p>{{ store.foo }}</p>
</template>
