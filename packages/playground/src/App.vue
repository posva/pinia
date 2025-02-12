<template>
  <header>
    <h1>🍍 Pinia playground</h1>
    <nav>
      <template v-for="(page, i) in pages" :key="page.name">
        <router-link :to="page" v-slot="{ route }">{{
          route.fullPath
        }}</router-link>
        <template v-if="i < pages.length - 1"> · </template>
      </template>
    </nav>
  </header>

  <section>
    <router-view />
  </section>

  <footer>
    <p>
      ©2021 Eduardo San Martin Morote
      <br />
      <a :href="sourceCodeLink">Source Code</a>
    </p>
  </footer>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

provide('hello', 'from component')

const pages = router
  .getRoutes()
  .filter((route) => !route.meta.hide)
  .map((route) => ({ name: route.name }))

const sourceCodeLink = computed(() => {
  if (route.name) {
    return `https://github.com/vuejs/pinia/blob/v3/packages/playground/src/views/${String(
      route.name
    )}.vue`
  } else {
    return `https://github.com/vuejs/pinia/blob/v3/packages/playground/src/`
  }
})
</script>

<style>
button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
