<script setup lang="ts">
import Header from './Header.vue'
import { Repl, useStore, useVueImportMap, SFCOptions, ReplProps } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import { computed, ref, watchEffect, onMounted, provide } from 'vue'
import { AppVue, PiniaVersionKey, counterTs } from './defaults'

const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}
window.addEventListener('resize', setVH)
setVH()

const useDevMode = ref(false)

let hash = location.hash.slice(1)
if (hash.startsWith('__DEV__')) {
  hash = hash.slice(7)
  useDevMode.value = true
}

const {
  importMap: builtinImportMap,
  vueVersion,
  productionMode,
} = useVueImportMap({
  runtimeDev: 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.runtime.esm-browser.js',
  runtimeProd: 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.runtime.esm-browser.prod.js',
  serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3/dist/server-renderer.esm-browser.js',
})

const store = useStore(
  {
    // pre-set import map
    builtinImportMap: computed(() => ({
      imports: {
        ...builtinImportMap.value.imports,
        ...(import.meta.env.PROD
        ? {
            pinia: '/pinia.esm-browser.js',
            '@vue/devtools-api': 'https://cdn.jsdelivr.net/npm/@vue/devtools-api@6.6.1/lib/esm/index.js',
            // Latest 3.x version
            'vue-demi': 'https://cdn.jsdelivr.net/npm/vue-demi@0/lib/v3/index.mjs',
            // Latest 5.x version
            'typescript': 'https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.min.js',
          }
        : {
            pinia: '/src/pinia-dev-proxy',
            vue: '/src/vue-dev-proxy',
            'vue/server-renderer': '/src/vue-server-renderer-dev-proxy',
            // Latest 5.x version
            'typescript': 'https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.min.js',
          }),
      }
    })),
    vueVersion,
    sfcOptions: computed(() => sfcOptions),
  },
  // initialize repl with previously serialized state
  hash,
)

const previewOptions: ReplProps['previewOptions'] = {
  customCode: {
    importCode: `import { createPinia } from 'pinia'`,
    useCode: `app.use(createPinia())`,
  },
}

// enable experimental features
const sfcOptions: SFCOptions = {
  script: {
    inlineTemplate: !useDevMode.value,
    isProd: !useDevMode.value,
  },
  style: {
    isProd: !useDevMode.value,
  },
  template: {
    isProd: !useDevMode.value,
  },
}

const piniaVersion = ref(`latest`)
provide(PiniaVersionKey, piniaVersion)

// FIXME: cannot get autocompletion and auto import to work like it does for Vue
// watchEffect(() => {
//   store.state.dependencyVersion ??= {}
//   store.state.dependencyVersion.pinia ??=
//     piniaVersion.value === 'latest' ? '^2.1.0' : piniaVersion.value
// })

// FIXME: use a CDN that can fix the sub deps: https://play.pinia.vuejs.org/#eNp9VMFy2jAQ/RWNL8AEJJikOTCQuu3kkB7aTtOjL8ZeQMReaaQ1YYbxv3ctg0MI5GR79+3bt09a76Nv1sptBdE0mvnMaUvCA1VWFCmu5klEPokeEtSlNY7EXlQensk4ELVYOlOKnlSZqZDASfK9BBPMDHomCaB5h+8PEpyptgPz8QdBaYuUgL+EmC0qIoMizgqdvXDfUC/x5obbP2HmoATk/vuWWKKo65lqi5hgpjq2aBi1YkdlauXGG+TR9k2P5JDgiaYiRJqY1ajTJpJEKrxL8OVo4cyr55k2DB4eoTH7pHLYkjGFH6VWt2VrIuunSnGd9Gv1ARXfyy9yogq9aCBKYw67j8RsFDvp4CrnERBPxsw3/pqD9XOOj3IodTyWkzt5f8J5zFzkOyvruOJbeSvv3rNcI7iEVezZFtzIAQ/pwF036Ax4JGu46gRrPkXyfJOWenV2hpkprS7A/bak+aa9O8u0KMzrzxAjV0GnLFtD9nIhvvG7VuEfB0HQyTSUuhVQm358/gU7fu+Spcmr4uDMleRf8KaoGo0t7HuFOcs+wQW1T+FKalz98487AvTHoRqhwY2AD+7++GT0N7ns5ImLb8vJFnZbnMNS49kih8vPG9yBHCy7JHcPyw27kGx3vPsXzE8J+72wor1hK84Tb+VU9Adi/iD6B704FeMwVz3gRz2I6v/N038l

if (!hash) {
  store.setFiles({
    // gets the tsconfig and import map
    ...store.getFiles(),
    'App.vue': AppVue,
    'counter.ts': counterTs,
  })
}

// persist state
watchEffect(() => history.replaceState({}, '', store.serialize()))

// production mode is enabled
productionMode.value = import.meta.env.PROD

function toggleDevMode() {
  const dev = (useDevMode.value = !useDevMode.value)
  sfcOptions.script!.inlineTemplate =
    sfcOptions.script!.isProd =
    sfcOptions.template!.isProd =
    sfcOptions.style!.isProd =
      !dev
  store.setFiles(store.getFiles())
}

const theme = ref<'dark' | 'light'>('dark')
function toggleTheme(isDark: boolean) {
  theme.value = isDark ? 'dark' : 'light'
}

onMounted(() => {
  const cls = document.documentElement.classList
  toggleTheme(cls.contains('dark'))
})
</script>

<template>
  <Header
    :store="store"
    :dev="useDevMode"
    @toggle-theme="toggleTheme"
    @toggle-dev="toggleDevMode"
  />
  <Repl
    :theme="theme"
    :editor="Monaco"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
    :store="store"
    :showCompileOutput="true"
    :autoResize="true"
    :sfcOptions="sfcOptions"
    :clearConsole="false"
    :previewOptions="previewOptions"
  />
</template>

<style>
:root {
  --c-branding: #987a00;
  --c-branding-dark: #5ad26c;

  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}

.dark {
  --c-branding: #ffe166;

  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}

.dark {
  color-scheme: dark;
}

body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(var(--vh) - var(--nav-height)) !important;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>

<style scoped>
.vue-repl :deep(.split-pane) {
  --color-branding: var(--c-branding);
  --color-branding-dark: var(--c-branding-dark);
}
</style>
