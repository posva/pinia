### [0.10.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.10.0...@pinia/nuxt@0.10.1) (2025-02-12)

### Bug Fixes

- avoid including devtools code in builds ([d3b24a3](https://github.com/vuejs/pinia/commit/d3b24a3d6a4b5af82c8ef7e66e4cecd890c30fdd)), closes [#2910](https://github.com/vuejs/pinia/issues/2910)
- **nuxt:** usePinia composable type ([#2890](https://github.com/vuejs/pinia/issues/2890)) ([a32fb3b](https://github.com/vuejs/pinia/commit/a32fb3b9d61c58b56716931fef351fae1b479ff8))

## [0.10.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.9.0...@pinia/nuxt@0.10.0) (2025-02-11)

This version requires Vue 3.0 and Pinia 3.0. See the [migration guide](https://pinia.vuejs.org/cookbook/migration-v2-v3.html) for more information.

## [0.9.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.8.0...@pinia/nuxt@0.9.0) (2024-12-04)

This version requires at least Vue 2.7. On January 2025, Pinia 3.0 and `@pinia/nuxt` 1.0 will drop support for Vue 2 (which already reached EOL last year). If you need support or help migrating, you can [book help with Eduardo (@posva)](https://cal.com/posva/consultancy).

## [0.8.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.7.0...@pinia/nuxt@0.8.0) (2024-11-28)

This release partially fixes a bug in production of:

> vueDemi2.effectScope is not a function

The remaining part in in [nypm](https://github.com/unjs/nypm/pull/165). In the meantime, you will have to manually add `pinia` with your favorite package manager:

```sh
pnpm i pinia
```

### Bug Fixes

- allow module to install pinia alongside ([#2846](https://github.com/vuejs/pinia/issues/2846)) ([3e8ed69](https://github.com/vuejs/pinia/commit/3e8ed69addc30954b887241faed8778048e5d20e))

# [0.7.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.6.1...@pinia/nuxt@0.7.0) (2024-11-03)

### Bug Fixes

- dedupe pinia ([#2821](https://github.com/vuejs/pinia/issues/2821)) ([90d8eb9](https://github.com/vuejs/pinia/commit/90d8eb900071964388c54d579ffc84c8ef01c191))

## [0.6.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.6.0...@pinia/nuxt@0.6.1) (2024-10-31)

### Bug Fixes

- upgrade minimum version for nuxt kit ([3dab0a6](https://github.com/vuejs/pinia/commit/3dab0a6a43f00d7a52d62d53748c7d5e0cb061ea)), closes [#2814](https://github.com/vuejs/pinia/issues/2814)

# [0.6.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.5...@pinia/nuxt@0.6.0) (2024-10-29)

### Bug Fixes

- avoid broken alias ([65031ee](https://github.com/vuejs/pinia/commit/65031ee77ed46a34bc2359223e24c7944e840819))
- **nuxt:** ensure payload plugin declaration is generated ([#2806](https://github.com/vuejs/pinia/issues/2806)) ([99ab76c](https://github.com/vuejs/pinia/commit/99ab76c685405a93f7fc41b335fe5710e9b7fee8))

### Features

- **nuxt:** do not serialize skipHydrate properties ([e645fc1](https://github.com/vuejs/pinia/commit/e645fc12ea115a2d2cc395ad83e4cc3df350c4ea))

## [0.5.5](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.4...@pinia/nuxt@0.5.5) (2024-09-30)

No changes in this release

## [0.5.4](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.3...@pinia/nuxt@0.5.4) (2024-08-21)

### Bug Fixes

- use correct pinia version range ([c34c0b6](https://github.com/vuejs/pinia/commit/c34c0b67fd635ae7b8d8dab5557ec5bdfc6d2741)), closes [vuejs/pinia#2748](https://github.com/vuejs/pinia/issues/2748)

## [0.5.3](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.2...@pinia/nuxt@0.5.3) (2024-08-06)

This release contain no code changes.

## [0.5.2](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.2-beta.0...@pinia/nuxt@0.5.2) (2024-07-26)

### Bug Fixes

- **types:** require unwrapped state in patch ([c38fa0d](https://github.com/vuejs/pinia/commit/c38fa0dbae5629509bc7d1ffc999b5aedfc3d3b7))

## [0.5.2-beta.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.1...@pinia/nuxt@0.5.2-beta.0) (2024-04-17)

### Bug Fixes

- opt in to `import.meta.*` properties ([#2622](https://github.com/vuejs/pinia/issues/2622)) ([0a94c3c](https://github.com/vuejs/pinia/commit/0a94c3c8c917a29c8e58cded33aa6f3e073f3577))
- **types:** use declare module vue ([8a6ce86](https://github.com/vuejs/pinia/commit/8a6ce86db83b6315c067c8a98c898b3c74efe62e))

## [0.5.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.1...@pinia/nuxt@0.5.1) (2024-04-04)

### Bug Fixes

- opt in to `import.meta.*` properties ([#2622](https://github.com/vuejs/pinia/issues/2622)) ([0a94c3c](https://github.com/vuejs/pinia/commit/0a94c3c8c917a29c8e58cded33aa6f3e073f3577))
- **types:** use declare module vue ([8a6ce86](https://github.com/vuejs/pinia/commit/8a6ce86db83b6315c067c8a98c898b3c74efe62e))

## [0.5.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.5.0...@pinia/nuxt@0.5.1) (2023-10-16)

### Bug Fixes

- **nuxt:** use srcDir by default for storesDirs ([dd90708](https://github.com/vuejs/pinia/commit/dd907089a688742d609bfd24c182cb7b6d6df375)), closes [#2447](https://github.com/vuejs/pinia/issues/2447)

### Features

- Add storeToRefs to the auto imports in @pinia/nuxt [#1876](https://github.com/vuejs/pinia/issues/1876) ([#2427](https://github.com/vuejs/pinia/issues/2427)) ([f19f368](https://github.com/vuejs/pinia/commit/f19f368a963be68940432bb0d4e0f5d74306c2d9))

# [0.5.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.11...@pinia/nuxt@0.5.0) (2023-10-13)

### Features

- **imports:** add storesDirs auto import ([70a95ba](https://github.com/vuejs/pinia/commit/70a95ba9b1d6a55aeea72088dfedd478aa4db766)), closes [#1604](https://github.com/vuejs/pinia/issues/1604)

### BREAKING CHANGES

- **imports:** the option `autoImports` has been removed as it offered  
  no value compared to the existing `imports` option in Nuxt. Instead, we
  are automatically adding `defineStore()`, and `acceptHMRUpdate()` to the
  list of auto imported functions. We are also adding the `./stores` dirs
  to auto imports now, so if you were manually adding that option, it can
  be removed.

## [0.4.11](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.10...@pinia/nuxt@0.4.11) (2023-05-17)

This release only contains build related changes

## [0.4.10](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.9...@pinia/nuxt@0.4.10) (2023-05-08)

This release only contains build related changes

## [0.4.9](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.8...@pinia/nuxt@0.4.9) (2023-04-20)

### Bug Fixes

- **nuxt:** add workaround to preserve type output ([#2147](https://github.com/vuejs/pinia/issues/2147)) ([65debf9](https://github.com/vuejs/pinia/commit/65debf9be0567159b932fcd0fc445a8a2bdbaa4d))
- **types:** typescript 5.0 acceptHMRUpdate error ([#2098](https://github.com/vuejs/pinia/issues/2098)) ([#2152](https://github.com/vuejs/pinia/issues/2152)) ([1469971](https://github.com/vuejs/pinia/commit/146997196f87abc691340fd46ae758a0865b8a73))

## [0.4.8](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.7...@pinia/nuxt@0.4.8) (2023-04-07)

### Bug Fixes

- support "types" condition in "exports" field ([#2078](https://github.com/vuejs/pinia/issues/2078)) ([66d3a5e](https://github.com/vuejs/pinia/commit/66d3a5edd03f28f52daf35449db8c5f660c70b01))

## [0.4.7](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.6...@pinia/nuxt@0.4.7) (2023-02-20)

No changes in this release

## [0.4.6](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.5...@pinia/nuxt@0.4.6) (2022-11-27)

### Bug Fixes

- **nuxt:** Avoid recursive import from Nuxt #imports ([#1823](https://github.com/vuejs/pinia/issues/1823)) ([e1c0a19](https://github.com/vuejs/pinia/commit/e1c0a19abca2b8574c81f6f6e3d1b324924ba68d))
- **nuxt:** use #app imports ([6cf7e48](https://github.com/vuejs/pinia/commit/6cf7e48264c575d705aeb41c978817a48e55978d))

## [0.4.5](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.4...@pinia/nuxt@0.4.5) (2022-11-21)

### Bug Fixes

- **nuxt:** ensure pinia plugin is added before router ([3e4e63c](https://github.com/vuejs/pinia/commit/3e4e63c1f4749ee09b045a771c546de33dd4c405))

## [0.4.4](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.3...@pinia/nuxt@0.4.4) (2022-11-17)

### Bug Fixes

- **nuxt:** nuxt v3 compatibility ([#1808](https://github.com/vuejs/pinia/issues/1808)) ([aa12958](https://github.com/vuejs/pinia/commit/aa129582306c03a186e4ba2009225d3b95feb1d9))

## [0.4.3](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.2...@pinia/nuxt@0.4.3) (2022-10-08)

- Update nuxt version and usage to rc.11

## [0.4.2](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.1...@pinia/nuxt@0.4.2) (2022-09-06)

### Bug Fixes

- **nuxt:** compatibility with `^3.0.0-rc.9` ([#1623](https://github.com/vuejs/pinia/issues/1623)) ([9864beb](https://github.com/vuejs/pinia/commit/9864beb9b4b12e4fa60db521b2943cb86dbedbef))

## [0.4.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.4.0...@pinia/nuxt@0.4.1) (2022-08-18)

### Features

- **nuxt:** automatically add pinia types ([#1551](https://github.com/vuejs/pinia/issues/1551)) ([5ebfcd8](https://github.com/vuejs/pinia/commit/5ebfcd8bbaaaacba7d03c66ac67775448fb02363))

# [0.4.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.3.1...@pinia/nuxt@0.4.0) (2022-08-10)

### Bug Fixes

- **nuxt:** fully resolve pinia path ([#1537](https://github.com/vuejs/pinia/issues/1537)) ([9c3b521](https://github.com/vuejs/pinia/commit/9c3b5213663555b1c21f8ca5ef22b386a96ed916))

## [0.3.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.3.0...@pinia/nuxt@0.3.1) (2022-07-25)

- doc generation changes

# [0.3.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.2.1...@pinia/nuxt@0.3.0) (2022-07-13)

**Please read the release notes if you are upgrading from a previous version.**

### Bug Fixes

- **nuxt:** correct type for `$nuxt` ([4f1a514](https://github.com/vuejs/pinia/commit/4f1a5149a189d2f36e3c57cb5bf79eafb6544856))

### Features

- **nuxt:** add `autoImports` option in module ([42be2fc](https://github.com/vuejs/pinia/commit/42be2fc22aa99353821d9595061ca991d42127ff))
- **nuxt:** deprecate old `$nuxt` context ([3e3041a](https://github.com/vuejs/pinia/commit/3e3041a84d2a1c7c4e6e62ac6c54ade949a1be94))
- **nuxt:** remove wrong `$nuxt` in Nuxt 3 ([67e5417](https://github.com/vuejs/pinia/commit/67e5417708d1ade18f42c16f6f0085e3787d06bf))
- usePinia composable ([c7debd6](https://github.com/vuejs/pinia/commit/c7debd692cf2034968dbaf7a72c39e621a3c5511))

### BREAKING CHANGES

- **nuxt:** `$nuxt` usage in stores defaults to type `any` unless
  you install the `@nuxt/types` package. This is because that package is
  quite heavy and can cause conflicts in projects not requiring it. Note
  `$nuxt` is deprecated and shouldn't be used (cf the other breaking
  changes notes).
- **nuxt:** Starting on this version, `@pinia/nuxt` only works with
  Nuxt 2 + Bridge and Nuxt 3, it no longer works with Nuxt 2 only. This is
  necessary to have one single plugin that works well with the different
  versions of Nuxt. If you aren't using bridge with Nuxt 2, check out the
  [migration guide](https://v3.nuxtjs.org/bridge/overview) or pin your
  `@pinia/nuxt` dependency in your:

  ```diff
  -    "@pinia/nuxt": "^0.2.1",
  +    "@pinia/nuxt": "0.2.1",
  ```

  The `$nuxt` context usage should be replaced with globals like
  `$fetch()` and `useNuxtApp()`. You can find more information about this
  in Nuxt documentation:

  - <https://v3.nuxtjs.org/bridge/bridge-composition-api/>
  - <https://v3.nuxtjs.org/bridge/overview>

- **nuxt:** in Nuxt 3, `$nuxt` is no longer available in stores.
  This is because it was removed in Nuxt 3 and it is no longer the
  _context_ as it used to be. Most of the features used there, like
  `$fetch` are now globally available and therefore remove the need of it.
  You can also use
  [`useNuxtApp()`](https://v3.nuxtjs.org/bridge/bridge-composition-api/)
  when necessary.

## [0.2.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.2.0...@pinia/nuxt@0.2.1) (2022-07-12)

### Bug Fixes

- **nuxt:** add back the nuxtState ([0f68174](https://github.com/vuejs/pinia/commit/0f6817459959c28d53130ac74f8da137a5f26860)), closes [#1447](https://github.com/vuejs/pinia/issues/1447)
- **nuxt:** use context.payload ([46775cf](https://github.com/vuejs/pinia/commit/46775cf77785102921ad233f63febf2f05102977)), closes [#1442](https://github.com/vuejs/pinia/issues/1442)

# [0.2.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.9...@pinia/nuxt@0.2.0) (2022-07-11)

### Bug Fixes

- **nuxt:** plugin injection on latest Nuxt 3 context ([#1433](https://github.com/vuejs/pinia/issues/1433)) ([bd0c52f](https://github.com/vuejs/pinia/commit/bd0c52f75645a49226f0473d4b0d3ad1a65635c7))

## [0.1.9](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.8...@pinia/nuxt@0.1.9) (2022-05-05)

Update build tools

## [0.1.8](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.7...@pinia/nuxt@0.1.8) (2021-12-24)

Override the 0.1.7 version for convenience but no code changes since 0.1.6.

## [0.1.7](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.6...@pinia/nuxt@0.1.7) (2021-12-20)

No code updates in this release

## [0.1.6](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.5...@pinia/nuxt@0.1.6) (2021-12-01)

Upgrade dependencies

## [0.1.5](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.4...@pinia/nuxt@0.1.5) (2021-11-11)

### Performance Improvements

- install plugins only once ([1b8e363](https://github.com/vuejs/pinia/commit/1b8e36355d52eb0934364bf622846e3bceced590))

## [0.1.4](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.3...@pinia/nuxt@0.1.4) (2021-11-10)

### Bug Fixes

- workaround prod build bug ([e1ebadb](https://github.com/vuejs/pinia/commit/e1ebadb4892608b02d370f18296a6bae256acd05))

## [0.1.3](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.2...@pinia/nuxt@0.1.3) (2021-11-10)

### Bug Fixes

- install vue composition api for vue 2 ([1287916](https://github.com/vuejs/pinia/commit/12879168d7e6f252f67431f1df02a9002642281e))

## [0.1.2](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.1...@pinia/nuxt@0.1.2) (2021-11-04)

### Bug Fixes

- **nuxt:** correct build export ([b2229cc](https://github.com/vuejs/pinia/commit/b2229cc8b35ed3be453fded8a52366406b1963db))

## [0.1.1](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.1.0...@pinia/nuxt@0.1.1) (2021-11-03)

### Bug Fixes

- **nuxt:** migrate to unbuild ([#765](https://github.com/vuejs/pinia/issues/765)) ([e8ccb71](https://github.com/vuejs/pinia/commit/e8ccb71e3ad5d1d5e55e1418e7c9f981f64c71ff))
- **nuxt:** use `@nuxt/kit` ([#764](https://github.com/vuejs/pinia/issues/764)) ([3d6d3cb](https://github.com/vuejs/pinia/commit/3d6d3cb95e1e9adbbe22234a892c138d2a18c767))

# [0.1.0](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.9...@pinia/nuxt@0.1.0) (2021-10-25)

- Adapt paths of dist files

## [0.0.9](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.8...@pinia/nuxt@0.0.9) (2021-10-21)

### Bug Fixes

- correct deps in nuxt plugin ([8020f99](https://github.com/vuejs/pinia/commit/8020f996e2b3c32685c88d0652b23a86bdcba507))
- correct peer deps and deps ([c83677a](https://github.com/vuejs/pinia/commit/c83677a9cf7a1cb20b2e6fed529f3c5500062648))
- should work with nuxt ([03159a4](https://github.com/vuejs/pinia/commit/03159a440de0eb2b17c3c3bd30dc64223fe90648))

## [0.0.8](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.7...@pinia/nuxt@0.0.8) (2021-10-20)

### Bug Fixes

- expose the plugin in mjs ([7a18af7](https://github.com/vuejs/pinia/commit/7a18af7dd7d40b491f01f7da4873733d56ded431))

## [0.0.7](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.6...@pinia/nuxt@0.0.7) (2021-10-19)

### Bug Fixes

- **nuxt3:** Rename `app` to `vueApp` ([#731](https://github.com/vuejs/pinia/issues/731)) ([f78c289](https://github.com/vuejs/pinia/commit/f78c289c8b6c2f8f7657dc46290b022df65945d0))
- transpile pinia for nuxt 2 ([7bf2e4a](https://github.com/vuejs/pinia/commit/7bf2e4a986d707dd3864a3dfc8933df0a683251e))

## [0.0.6](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.5...@pinia/nuxt@0.0.6) (2021-10-14)

### Bug Fixes

- link to correct file [skip ci] ([c44b771](https://github.com/vuejs/pinia/commit/c44b771b6e3f538df6c9b2aab1beca7a681f7d9a))

## [0.0.5](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.4...@pinia/nuxt@0.0.5) (2021-10-14)

### Bug Fixes

- **nuxt:** inject pinia after installing the plugin ([32dfdec](https://github.com/vuejs/pinia/commit/32dfdeca3d6413570d113f02314f57df9fecc42e))
- **nuxt:** inject state for nuxt 3 ([14999ce](https://github.com/vuejs/pinia/commit/14999ceefe2a326dbfb720eedd0889a2ae9e4169))
- **nuxt:** point to the correct dist file ([438b16d](https://github.com/vuejs/pinia/commit/438b16dfd3dd5052be437d2e7382f9f4f497eea3))

### Features

- **nuxt:** deprecate context.pinia in favor of context.$pinia ([7dbc8e8](https://github.com/vuejs/pinia/commit/7dbc8e864afcf2636f1c9aede0480c941ab2b4ef))

## [0.0.4](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.3...@pinia/nuxt@0.0.4) (2021-10-12)

### Bug Fixes

- **nuxt:** use latest nuxt kit ([4892546](https://github.com/vuejs/pinia/commit/4892546395654772561be7d33101dc52b03ccdeb)), closes [#717](https://github.com/vuejs/pinia/issues/717)

## [0.0.3](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.2...@pinia/nuxt@0.0.3) (2021-10-03)

### Bug Fixes

- export the module version in mjs ([cffc313](https://github.com/vuejs/pinia/commit/cffc3134ec4d44c7a0a1492d942d44dc5d838df1))
- **nuxt:** correct build ([435b294](https://github.com/vuejs/pinia/commit/435b2948f2290407c03b9652c7a754192e3e912f))

## [0.0.2](https://github.com/vuejs/pinia/compare/@pinia/nuxt@0.0.1...@pinia/nuxt@0.0.2) (2021-09-03)

### Features

- add typedoc ([b98e23d](https://github.com/vuejs/pinia/commit/b98e23d5588925c6a0094a92067a3cc5784e965d))

## 0.0.1 (2021-08-19)

### Features

- expose getActivePinia ([8b8d0c1](https://github.com/vuejs/pinia/commit/8b8d0c17958e3b4e2d9bc809c78a28931d1b00f0))
- **nuxt:** nuxt plugin working with Vue 2 ([2b3aa5f](https://github.com/vuejs/pinia/commit/2b3aa5f4c1d83bd1955727656c8403b4e02f4b16))
