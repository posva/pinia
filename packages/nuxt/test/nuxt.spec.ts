import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('works with nuxt', async () => {
  await setup({
    server: true,
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
    nuxtConfig: {
      hooks: {
        'vite:extendConfig'(config, { isClient }) {
          config.define!.__BROWSER__ = isClient
        },
      },
      vite: {
        define: {
          __DEV__: false,
          __TEST__: true,
          __FEATURE_PROD_DEVTOOLS__: false,
          __USE_DEVTOOLS__: false,
        },
      },
    },
  })

  it('works on ssr', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Count: 101')
  })

  it('drops state that is marked with skipHydrate', async () => {
    const html = await $fetch('/skip-hydrate')
    expect(html).not.toContain('I should not be serialized or hydrated')
    expect(html).toContain('skipHydrate-wrapped state is correct')
  })
})
