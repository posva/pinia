import path from 'node:path'
import { createTypeDocApp } from './typedoc-markdown.mjs'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

createTypeDocApp({
  textContentMappings: {
    'title.indexPage': 'API Reference',
    'title.memberPage': '{name}',
  },
  tsconfig: path.resolve(__dirname, './typedoc.tsconfig.json'),
  // entryPointStrategy: 'packages',
  categorizeByGroup: true,
  githubPages: false,
  readme: 'none',
  indexFormat: 'table',
  disableSources: true,
  plugin: ['typedoc-plugin-markdown', 'typedoc-vitepress-theme'],
  useCodeBlocks: true,
  entryPoints: [
    path.resolve(__dirname, '../pinia/src/index.ts'),
    path.resolve(__dirname, '../testing/src/index.ts'),
    path.resolve(__dirname, '../nuxt/src/module.ts'),
  ],
}).then((app) => app.build())
