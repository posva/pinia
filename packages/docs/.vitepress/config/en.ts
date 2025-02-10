import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import typedocSidebar from '../../api/typedoc-sidebar.json'

export const META_URL = 'https://pinia.vuejs.org'
export const META_TITLE = 'Pinia 🍍'
export const META_DESCRIPTION =
  'Intuitive, type safe, light and flexible Store for Vue'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: META_DESCRIPTION,
  head: [
    ['meta', { property: 'og:url', content: META_URL }],
    ['meta', { property: 'og:description', content: META_DESCRIPTION }],
    ['meta', { property: 'twitter:url', content: META_URL }],
    ['meta', { property: 'twitter:title', content: META_TITLE }],
    ['meta', { property: 'twitter:description', content: META_DESCRIPTION }],
  ],

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/vuejs/pinia/edit/v2/packages/docs/:path',
      text: 'Suggest changes to this page',
    },

    nav: [
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      {
        text: 'Guide',
        link: '/core-concepts/',
        activeMatch: '^/core-concepts/',
      },
      { text: 'API', link: '/api/', activeMatch: '^/api/' },
      { text: 'Cookbook', link: '/cookbook/', activeMatch: '^/cookbook/' },
      {
        text: 'Links',
        items: [
          {
            text: 'Discussions',
            link: 'https://github.com/vuejs/pinia/discussions',
          },
          {
            text: 'Changelog',
            link: 'https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md',
          },
          {
            text: 'Vue.js Certification',
            link: 'https://certificates.dev/vuejs/?friend=VUEROUTER&utm_source=pinia_vuejs&utm_medium=link&utm_campaign=pinia_vuejs_links&utm_content=navbar',
          },
          {
            text: 'v3.x',
            items: [{ text: 'v2.x', link: 'https://v2.pinia.vuejs.org' }],
          },
        ],
      },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'API',
          items: typedocSidebar,
        },
      ],
      // catch-all fallback
      '/': [
        {
          text: 'Introduction',
          items: [
            {
              text: 'What is Pinia?',
              link: '/introduction.html',
            },
            {
              text: 'Getting Started',
              link: '/getting-started.html',
            },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Defining a Store', link: '/core-concepts/' },
            { text: 'State', link: '/core-concepts/state.html' },
            { text: 'Getters', link: '/core-concepts/getters.html' },
            { text: 'Actions', link: '/core-concepts/actions.html' },
            { text: 'Plugins', link: '/core-concepts/plugins.html' },
            {
              text: 'Stores outside of components',
              link: '/core-concepts/outside-component-usage.html',
            },
          ],
        },
        {
          text: 'Server-Side Rendering (SSR)',
          items: [
            {
              text: 'Vue and Vite',
              link: '/ssr/',
            },
            {
              text: 'Nuxt.js',
              link: '/ssr/nuxt.html',
            },
          ],
        },
        {
          text: 'Cookbook',
          collapsed: false,
          items: [
            {
              text: 'Index',
              link: '/cookbook/',
            },
            {
              text: 'Migration from Vuex ≤4',
              link: '/cookbook/migration-vuex.html',
            },
            {
              text: 'Hot Module Replacement',
              link: '/cookbook/hot-module-replacement.html',
            },
            {
              text: 'Testing',
              link: '/cookbook/testing.html',
            },
            {
              text: 'Usage without setup()',
              link: '/cookbook/options-api.html',
            },
            {
              text: 'Composing Stores',
              link: '/cookbook/composing-stores.html',
            },
            {
              text: 'VSCode Snippets',
              link: '/cookbook/vscode-snippets.html',
            },
            {
              text: 'Migration from v2 to v3',
              link: '/cookbook/migration-v2-v3.html',
            },
            {
              text: 'Migration from v0/v1 to v2',
              link: '/cookbook/migration-v1-v2.html',
            },
            {
              text: 'Dealing with composables',
              link: '/cookbook/composables.html',
            },
          ],
        },
      ],
    },
  },
}
