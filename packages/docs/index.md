---
layout: home

title: Pinia
titleTemplate: The intuitive store for Vue.js

hero:
  name: Pinia
  text: The intuitive store for Vue.js
  tagline: Type Safe, Extensible, and Modular by design. Forget you are even using a store.
  image:
    src: /logo.svg
    alt: Pinia
  actions:
    - theme: brand
      text: Get Started
      link: /introduction
    - theme: alt
      text: Demo
      link: https://stackblitz.com/github/piniajs/example-vue-3-vite
    - theme: cta mastering-pinia
      text: ' '
      link: https://masteringpinia.com
    - theme: cta vueschool
      text: Watch Video Introduction
      link: https://vueschool.io/lessons/introduction-to-pinia?friend=vuerouter&utm_source=pinia&utm_medium=link&utm_campaign=homepage
    - theme: cta vue-mastery
      text: Get the Pinia Cheat Sheet
      link: https://www.vuemastery.com/pinia?coupon=PINIA-DOCS&via=eduardo

features:
  - title: 💡 Intuitive
    details: Stores are as familiar as components. API designed to let you write well organized stores.
  - title: 🔑 Type Safe
    details: Types are inferred, which means stores provide you with autocompletion even in JavaScript!
  - title: ⚙️ Devtools support
    details: Pinia hooks into Vue devtools to give you an enhanced development experience.
  - title: 🔌 Extensible
    details: React to store changes and actions to extend Pinia with transactions, local storage synchronization, etc.
  - title: 🏗 Modular by design
    details: Build multiple stores and let your bundler code split them automatically.
  - title: 📦 Extremely light
    details: Pinia weighs ~1.5kb, you will forget it's even there!
---

<script setup>
import HomeSponsors from './.vitepress/theme/components/HomeSponsors.vue'
import './.vitepress/theme/styles/home-links.css'
</script>

<HomeSponsors />
