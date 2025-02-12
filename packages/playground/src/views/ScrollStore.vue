<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { getActivePinia } from 'pinia';
import { onBeforeRouteLeave } from 'vue-router';
import { useScroll } from '../stores/scroll'

const bodyStyle = document.body.style
const appStyle = document.getElementById('app')!.style

const scrollStore = useScroll()

onMounted(() => {
  bodyStyle.setProperty('height', '300vh')
  appStyle.setProperty('position', 'sticky')
  appStyle.setProperty('top', '0')
})

onBeforeUnmount(() => {
  bodyStyle.removeProperty('height')
  appStyle.removeProperty('position')
  appStyle.removeProperty('top')
})

onBeforeRouteLeave(() => {
  scrollStore.$dispose()
  const pinia = getActivePinia()
  delete pinia!.state.value[scrollStore.$id]
})
</script>

<template>
  <div style="position: sticky; top: 0;">
    <h2>Scroll Store</h2>
    <p><strong>Scroll top:</strong> {{ scrollStore.scrollTop }}</p>
    <p>During development, after saving changes in <code>/stores/scroll.ts</code>, the <code>acceptHMRUpdate</code> function is configured to run the <code>$cleanUp</code> function on the existing store just before the new store is initialized.</p>
    <p>You can only verify this manually by making changes in <code>/stores/scroll.ts</code> and checking what scroll event listeners are on the <code>&lt;html&gt;</code> element. There should always only be one.</p>
  </div>
</template>
