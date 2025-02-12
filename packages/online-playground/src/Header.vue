<script setup lang="ts">
import { downloadProject } from './download/download'
import { inject, ref } from 'vue'
import Sun from './icons/Sun.vue'
import Moon from './icons/Moon.vue'
import Share from './icons/Share.vue'
import Download from './icons/Download.vue'
import GitHub from './icons/GitHub.vue'
import type { ReplStore } from '@vue/repl'
import VersionSelect from './VersionSelect.vue'
import { PiniaVersionKey } from './defaults'

const props = defineProps<{
  store: ReplStore
  dev: boolean
}>()
const emit = defineEmits(['toggle-theme', 'toggle-dev'])

const { store } = props

const currentCommit = __COMMIT__
// parse version from the runtimeURL
const vueVersion = ref('latest')
const piniaVersion = inject(PiniaVersionKey)!

async function setVueVersion(v: string) {
  vueVersion.value = `loading...`
  await store.setVueVersion(v)
  vueVersion.value = `v${v}`
}

async function copyLink(e: MouseEvent) {
  if (e.metaKey) {
    // hidden logic for going to local debug from play.vuejs.org
    window.location.href = 'http://localhost:5173/' + window.location.hash
    return
  }
  await navigator.clipboard.writeText(location.href)
  alert('Sharable URL has been copied to clipboard.')
}

function toggleDark() {
  const cls = document.documentElement.classList
  cls.toggle('dark')
  localStorage.setItem(
    'vue-sfc-playground-prefer-dark',
    String(cls.contains('dark'))
  )
  emit('toggle-theme', cls.contains('dark'))
}
</script>

<template>
  <nav>
    <h1>
      <a href="https://masteringpinia.com" target="_blank">
        <img alt="logo" src="/logo-mp.png" />
        <span>Pinia Playground</span>
      </a>
    </h1>
    <div class="links">
      <VersionSelect v-model="store.state.typescriptVersion" pkg="typescript">
        <template #label>
          <img src="/logo-ts.svg" alt="TypeScript" class="version-logo" />
        </template>
      </VersionSelect>
      <!-- <VersionSelect
        :model-value="vueVersion"
        @update:model-value="setVueVersion"
        pkg="vue"
        label="Vue Version"
      >
        <li>
          <a @click="resetVueVersion">This Commit ({{ currentCommit }})</a>
        </li>
        <li>
          <a
            href="https://app.netlify.com/sites/vue-sfc-playground/deploys"
            target="_blank"
            >Commits History</a
          >
        </li>
      </VersionSelect> -->
      <VersionSelect
        :model-value="store.vueVersion || 'latest'"
        @update:model-value="setVueVersion"
        pkg="vue"
      >
        <template #label>
          <img src="/logo-vue.svg" alt="Vue" class="version-logo" />
        </template>
      </VersionSelect>

      <button
        title="Toggle development production mode"
        class="toggle-dev"
        :class="{ dev }"
        @click="$emit('toggle-dev')"
      >
        <span>{{ dev ? 'DEV' : 'PROD' }}</span>
      </button>
      <button title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
        <Sun class="light" />
        <Moon class="dark" />
      </button>
      <button title="Copy sharable URL" class="share" @click="copyLink">
        <Share />
      </button>
      <button
        title="Download project files"
        class="download"
        @click="downloadProject(store)"
      >
        <Download />
      </button>
      <a
        href="https://github.com/vuejs/pinia/tree/v3/packages/online-playground"
        target="_blank"
        title="View on GitHub"
        class="github"
      >
        <GitHub />
      </a>
    </div>
  </nav>
</template>

<style>
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;
  --btn: #666;
  --highlight: #333;
  --green: #3ca877;
  --purple: #904cbc;
  --btn-bg: #eee;

  color: var(--base);
  height: var(--nav-height);
  box-sizing: border-box;
  padding: 0 1em;
  background-color: var(--bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

.dark nav {
  --base: #ddd;
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;
  --highlight: #fff;
  --btn-bg: #333;

  box-shadow: none;
  border-bottom: 1px solid var(--border);
}

h1 {
  font-weight: 500;
  display: inline-flex;
  place-items: center;
}

h1 a {
  color: var(--color-branding);
  text-decoration: none;
}

h1 img {
  height: 24px;
  margin-right: 10px;

  animation: hithere 4s ease 5;
  /* animation-delay: 5s; */
}
@keyframes hithere {
  78% {
    transform: scale(1);
  }
  79% {
    transform: scale(1.2);
  }
  82%,
  86% {
    transform: rotate(-20deg) scale(1.2);
  }
  85% {
    transform: rotate(20deg) scale(1.2);
  }
  91% {
    transform: rotate(0deg) scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 570px) {
  h1 span {
    display: none;
  }
}

@media (max-width: 770px) {
  btn.download {
    display: none;
  }
}

.links {
  display: flex;
}

.toggle-dev span {
  font-size: 12px;
  border-radius: 4px;
  padding: 4px 6px;
}

.toggle-dev span {
  background: var(--purple);
  color: #fff;
}

.toggle-dev.dev span {
  background: var(--green);
}

.toggle-dark svg {
  width: 18px;
  height: 18px;
}

.toggle-dark .dark,
.dark .toggle-dark .light {
  display: none;
}

.dark .toggle-dark .dark {
  display: inline-block;
}

.links button,
.links .github {
  padding: 1px 6px;
  color: var(--btn);
}

.links button:hover,
.links .github:hover {
  color: var(--highlight);
}

.version:hover .active-version::after {
  border-top-color: var(--btn);
}

.dark .version:hover .active-version::after {
  border-top-color: var(--highlight);
}

.versions {
  display: none;
  position: absolute;
  left: 0;
  top: 40px;
  background-color: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 4px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
  width: 200px;
  max-height: calc(100vh - 70px);
  overflow: scroll;
}

.versions a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  cursor: pointer;
  color: var(--base);
}

.versions a:hover {
  color: var(--color-branding);
}

.versions.expanded {
  display: block;
}

.links > * {
  display: flex;
  align-items: center;
}

.links > * + * {
  margin-left: 4px;
}

.version-logo {
  height: 1.2em;
  margin-right: 4px;
}
</style>
