## [2.3.0](https://github.com/vuejs/pinia/compare/pinia@2.2.6...pinia@2.3.0) (2024-12-04)

This version requires at least Vue 2.7. On January 2025, Pinia 3.0 will drop support for Vue 2 (which already reached EOL last year). If you need support or help migrating, you can [book help with Eduardo (@posva)](https://cal.com/posva/consultancy).

### Features

- writable `computed`s to be picked up by `mapWritableState` ([#2847](https://github.com/vuejs/pinia/issues/2847)) ([0fa633e](https://github.com/vuejs/pinia/commit/0fa633e81864b09d300859a0ed1c10d2a89affa8))

### Bug Fixes

- avoid npm bug when resolving optional deps ([#2841](https://github.com/vuejs/pinia/issues/2841)) ([1e45f33](https://github.com/vuejs/pinia/commit/1e45f332efe8c0f543cfd186cd26b768abdf2b62))

### [2.2.8](https://github.com/vuejs/pinia/compare/v2.2.7...v2.2.8) (2024-11-28)

### Features

- deprecate old defineStore ([d1858e8](https://github.com/vuejs/pinia/commit/d1858e8c932d89cd2bf9121fe62179795ebb5c5f))

### Bug Fixes

- avoid immediate computing with `storeToRefs` ([67d3109](https://github.com/vuejs/pinia/commit/67d31094784cc3bd256b0636b79dc8e421f6c3fb)), closes [#2812](https://github.com/vuejs/pinia/issues/2812)
- **types:** unwrap refs in `mapWritableState` for setup stores ([#2805](https://github.com/vuejs/pinia/issues/2805)) ([ea14e53](https://github.com/vuejs/pinia/commit/ea14e53fdfc0d0f4cd80d5242572f87714a77e3b)), closes [#2804](https://github.com/vuejs/pinia/issues/2804)

### [2.2.7](https://github.com/vuejs/pinia/compare/pinia@2.2.6...v2.2.7) (2024-11-27)

### Bug Fixes

- **devtools:** avoid running outside of browsers ([eb5e6fd](https://github.com/vuejs/pinia/commit/eb5e6fd6073da8e828a9087c876d0e8fde3cdb3d)), closes [#2843](https://github.com/vuejs/pinia/issues/2843)

## [2.2.6](https://github.com/vuejs/pinia/compare/pinia@2.2.5...pinia@2.2.6) (2024-11-03)

No code changes in this release

## [2.2.5](https://github.com/vuejs/pinia/compare/pinia@2.2.4...pinia@2.2.5) (2024-10-29)

### Bug Fixes

- keep no side effect comment when minifying ([a31fb87](https://github.com/vuejs/pinia/commit/a31fb877aed1843fc144d09488e2b45afc917bf9))
- reference the store directly in storeToRefs to ensure correct reactivity after HMR ([#2795](https://github.com/vuejs/pinia/issues/2795)) ([254eec7](https://github.com/vuejs/pinia/commit/254eec764ecccd120ab9dbc31352d76ffd6ecfa3))
- **types:** handle union types in generic parameter ([#2794](https://github.com/vuejs/pinia/issues/2794)) ([ecc7449](https://github.com/vuejs/pinia/commit/ecc74492c642539ffc7386d57a8f9853437be327)), closes [#2785](https://github.com/vuejs/pinia/issues/2785)
- up minimum peer dep of Vue ([5404d3e](https://github.com/vuejs/pinia/commit/5404d3e472ed0ac8ba0f09f501618908fe438c57)), closes [#2797](https://github.com/vuejs/pinia/issues/2797)

### Features

- **nuxt:** do not serialize skipHydrate properties ([e645fc1](https://github.com/vuejs/pinia/commit/e645fc12ea115a2d2cc395ad83e4cc3df350c4ea))

## [2.2.4](https://github.com/vuejs/pinia/compare/pinia@2.2.3...pinia@2.2.4) (2024-10-01)

### Bug Fixes

- **types:** allow writable getters with storeToRefs ([b464a1f](https://github.com/vuejs/pinia/commit/b464a1f4ff499aff34087cc9cd77ad19cf8646a7)), closes [#2767](https://github.com/vuejs/pinia/issues/2767)

## [2.2.3](https://github.com/vuejs/pinia/compare/pinia@2.2.2...pinia@2.2.3) (2024-09-30)

### Bug Fixes

- **types:** allow writable getters ([94f5a63](https://github.com/vuejs/pinia/commit/94f5a63fdc86f17f1dd17ed16534fbdecb8c448f)), closes [#2767](https://github.com/vuejs/pinia/issues/2767)
- **types:** Don't double UnwrapRef in setup stores ([#2771](https://github.com/vuejs/pinia/issues/2771)) ([5ad1765](https://github.com/vuejs/pinia/commit/5ad17654de4153b6f26b45b20029ca9ac4885f8d)), closes [#2770](https://github.com/vuejs/pinia/issues/2770)
- **types:** storeToRefs with nested refs ([#2659](https://github.com/vuejs/pinia/issues/2659)) ([623e5a0](https://github.com/vuejs/pinia/commit/623e5a0fe3444a4aa9c4908668927ee66f6352ba))

## [2.2.2](https://github.com/vuejs/pinia/compare/pinia@2.2.1...pinia@2.2.2) (2024-08-15)

### Features

- improve tree shaking on `defineStore` ([#2740](https://github.com/vuejs/pinia/issues/2740)) ([3069105](https://github.com/vuejs/pinia/commit/3069105f15858393e5386bac7e62ea32a46c80bb))

## [2.2.1](https://github.com/vuejs/pinia/compare/pinia@2.2.0...pinia@2.2.1) (2024-08-06)

### Bug Fixes

- **types:** breaking type with auto imported components ([#2730](https://github.com/vuejs/pinia/issues/2730)) ([82ca41c](https://github.com/vuejs/pinia/commit/82ca41c7d0f15439356c032bc12a4f825a290af6))

# [2.2.0](https://github.com/vuejs/pinia/compare/pinia@2.1.8-beta.0...pinia@2.2.0) (2024-07-26)

### Bug Fixes

- **types:** require unwrapped state in patch ([c38fa0d](https://github.com/vuejs/pinia/commit/c38fa0dbae5629509bc7d1ffc999b5aedfc3d3b7))

### Features

- add `action` helper to consistently `$onAction` ([a8526fc](https://github.com/vuejs/pinia/commit/a8526fc78894423ee87c3059228cd97097e37f27))
- **devtools:** expose selected store as global variable ([#2692](https://github.com/vuejs/pinia/issues/2692)) ([e0a7351](https://github.com/vuejs/pinia/commit/e0a73512af38050111ecbcf881908541aff9414d))

## [2.1.8-beta.0](https://github.com/vuejs/pinia/compare/pinia@2.1.7...pinia@2.1.8-beta.0) (2024-04-17)

### Bug Fixes

- **devtools:** Do not patch mocked actions ([#2300](https://github.com/vuejs/pinia/issues/2300)) ([069ffd1](https://github.com/vuejs/pinia/commit/069ffd14a52ccb576d63d03d06b18dee69185ae7))
- support webpack minification ([57914b5](https://github.com/vuejs/pinia/commit/57914b522fb901701c397a5ef62dad3339ee0cf9)), closes [#1143](https://github.com/vuejs/pinia/issues/1143)
- **types:** fix storeToRefs state return type ([#2574](https://github.com/vuejs/pinia/issues/2574)) ([#2604](https://github.com/vuejs/pinia/issues/2604)) ([c8f727a](https://github.com/vuejs/pinia/commit/c8f727a0a2187c591134bd467efe426fb747ea40))
- **types:** mapHelpers with getters types ([#2571](https://github.com/vuejs/pinia/issues/2571)) ([#2576](https://github.com/vuejs/pinia/issues/2576)) ([ea5c974](https://github.com/vuejs/pinia/commit/ea5c974c73d458518aff318dbab369e506db9285))
- **types:** use declare module vue ([8a6ce86](https://github.com/vuejs/pinia/commit/8a6ce86db83b6315c067c8a98c898b3c74efe62e))

### Features

- disposePinia ([bb8bf60](https://github.com/vuejs/pinia/commit/bb8bf60581747c76e42796b82eb3aa04e2336fdf)), closes [vuejs/pinia#2453](https://github.com/vuejs/pinia/issues/2453)

## [2.1.7](https://github.com/vuejs/pinia/compare/pinia@2.1.7...pinia@2.1.7) (2024-04-04)

### Bug Fixes

- support webpack minification ([57914b5](https://github.com/vuejs/pinia/commit/57914b522fb901701c397a5ef62dad3339ee0cf9)), closes [#1143](https://github.com/vuejs/pinia/issues/1143)
- **types:** fix storeToRefs state return type ([#2574](https://github.com/vuejs/pinia/issues/2574)) ([#2604](https://github.com/vuejs/pinia/issues/2604)) ([c8f727a](https://github.com/vuejs/pinia/commit/c8f727a0a2187c591134bd467efe426fb747ea40))
- **types:** mapHelpers with getters types ([#2571](https://github.com/vuejs/pinia/issues/2571)) ([#2576](https://github.com/vuejs/pinia/issues/2576)) ([ea5c974](https://github.com/vuejs/pinia/commit/ea5c974c73d458518aff318dbab369e506db9285))
- **types:** use declare module vue ([8a6ce86](https://github.com/vuejs/pinia/commit/8a6ce86db83b6315c067c8a98c898b3c74efe62e))

### Features

- disposePinia ([bb8bf60](https://github.com/vuejs/pinia/commit/bb8bf60581747c76e42796b82eb3aa04e2336fdf)), closes [vuejs/pinia#2453](https://github.com/vuejs/pinia/issues/2453)

## [2.1.7](https://github.com/vuejs/pinia/compare/pinia@2.1.6...pinia@2.1.7) (2023-10-13)

### Bug Fixes

- **devtools:** correctly load initial states ([9d49e30](https://github.com/vuejs/pinia/commit/9d49e3005ca677f8892e7af209e96d43b41e121c))

### Features

- **types:** SetupStoreDefinition ([391f9ac](https://github.com/vuejs/pinia/commit/391f9ac4f5e845afdd4b7d44fb1a9c7fb2b299a0))
- **warn:** improve getActivePinia warning ([4640f09](https://github.com/vuejs/pinia/commit/4640f09d12094d8c2c2d9d2039b4479fd7d38d35))

## [2.1.6](https://github.com/vuejs/pinia/compare/pinia@2.1.5...pinia@2.1.6) (2023-07-26)

### Bug Fixes

- **devtools:** preserve store reactivity ([709ed3b](https://github.com/vuejs/pinia/commit/709ed3b3a4787c3a9b5a59f863558b480a96eaaf))

## [2.1.5](https://github.com/vuejs/pinia/compare/pinia@2.1.4...pinia@2.1.5) (2023-07-26)

### Bug Fixes

- **devtools:** correctly load the state ([beff091](https://github.com/vuejs/pinia/commit/beff091f80302def494305779f8aa1d12301bce4))
- **devtools:** wrong toast message ([#2290](https://github.com/vuejs/pinia/issues/2290)) ([dfc04d3](https://github.com/vuejs/pinia/commit/dfc04d356c86128f868b12182615bd57228111d6))

## [2.1.4](https://github.com/vuejs/pinia/compare/pinia@2.1.3...pinia@2.1.4) (2023-06-14)

### Bug Fixes

- **devtools:** group setup store sync actions mutations ([683efe1](https://github.com/vuejs/pinia/commit/683efe1a34cbca82c1ef19d268e3080503401de2))

## [2.1.3](https://github.com/vuejs/pinia/compare/pinia@2.1.2...pinia@2.1.3) (2023-05-18)

### Bug Fixes

- **types:** revert declare module vue ([3000161](https://github.com/vuejs/pinia/commit/3000161205e66838d872e514a9e90f73a1b37039))

## [2.1.2](https://github.com/vuejs/pinia/compare/pinia@2.1.1...pinia@2.1.2) (2023-05-18)

- Force vue-demi version

## [2.1.1](https://github.com/vuejs/pinia/compare/pinia@2.1.0...pinia@2.1.1) (2023-05-17)

### Bug Fixes

- expect Vue 3.3 ([b8fb165](https://github.com/vuejs/pinia/commit/b8fb1653211dbe6dc6aa3a8ac36185bf93bcfa25))

# [2.1.0](https://github.com/vuejs/pinia/compare/pinia@2.0.36...pinia@2.1.0) (2023-05-17)

‼️ This **requires** Vue 3.3 or latest vue-demi (for Vue 2)

### Bug Fixes

- **types:** use declare module vue ([b7f97dd](https://github.com/vuejs/pinia/commit/b7f97ddf160e999da7b639ba4fcaf554bed5f1e2))

### Features

- allow app injections in setup stores ([6a71019](https://github.com/vuejs/pinia/commit/6a71019ef2a633dcb097a63be895a8b1714863b6)), closes [#1784](https://github.com/vuejs/pinia/issues/1784)
- **devtools:** allow resetting setup stores from inspector ([971dcdb](https://github.com/vuejs/pinia/commit/971dcdbf4b825e1791d02a85d6788fa72236107c)), closes [#2189](https://github.com/vuejs/pinia/issues/2189)

### Reverts

- Revert "chore: tmp upgrade to beta" ([2337130](https://github.com/vuejs/pinia/commit/2337130b0f11a3218a972555b84df6b2c055e6dc))

## [2.0.36](https://github.com/vuejs/pinia/compare/pinia@2.0.35...pinia@2.0.36) (2023-05-08)

### Features

- **dx:** throw an error if store id is missing ([#2167](https://github.com/vuejs/pinia/issues/2167)) ([b74eb4f](https://github.com/vuejs/pinia/commit/b74eb4f9b5a2a20a9c8d3cedd221eea8dde201f6))
- **warn:** improve warning message ([73518b3](https://github.com/vuejs/pinia/commit/73518b3f94fb164d02e740cb3132767a0d2a397b))

## [2.0.35](https://github.com/vuejs/pinia/compare/pinia@2.0.34...pinia@2.0.35) (2023-04-20)

### Bug Fixes

- **types:** typescript 5.0 acceptHMRUpdate error ([#2098](https://github.com/vuejs/pinia/issues/2098)) ([#2152](https://github.com/vuejs/pinia/issues/2152)) ([1469971](https://github.com/vuejs/pinia/commit/146997196f87abc691340fd46ae758a0865b8a73))

### Features

- **types:** improve setActivePinia types ([1650c6e](https://github.com/vuejs/pinia/commit/1650c6efebc75fdc47b2ec082ba10c197b894aef))

## [2.0.34](https://github.com/vuejs/pinia/compare/pinia@2.0.33...pinia@2.0.34) (2023-04-07)

No changes in this release

## [2.0.33](https://github.com/vuejs/pinia/compare/pinia@2.0.32...pinia@2.0.33) (2023-03-06)

### Bug Fixes

- allow `$reset` to be overridden by plugins ([#2054](https://github.com/vuejs/pinia/issues/2054)) ([709e2b1](https://github.com/vuejs/pinia/commit/709e2b1a77410331ee1ce88212ac55a4e92fa941))

## [2.0.32](https://github.com/vuejs/pinia/compare/pinia@2.0.31...pinia@2.0.32) (2023-02-21)

### Bug Fixes

- **types:** mapWritableState array ([a7ad90d](https://github.com/vuejs/pinia/commit/a7ad90d319c4fad29f40622a6b95e605c47377f9)), closes [#2014](https://github.com/vuejs/pinia/issues/2014)

## [2.0.31](https://github.com/vuejs/pinia/compare/pinia@2.0.30...pinia@2.0.31) (2023-02-20)

### Bug Fixes

- **types:** mapWritableState array ([07eaf99](https://github.com/vuejs/pinia/commit/07eaf99a566ef5de4173b782504a163bd276e12e)), closes [#2014](https://github.com/vuejs/pinia/issues/2014)

## [2.0.30](https://github.com/vuejs/pinia/compare/pinia@2.0.29...pinia@2.0.30) (2023-02-01)

### Bug Fixes

- avoid spread operator even in devtools code ([d2a4def](https://github.com/vuejs/pinia/commit/d2a4defc381ae8e023b45b05e4ac8588fe2add9e)), closes [#1885](https://github.com/vuejs/pinia/issues/1885)

## [2.0.29](https://github.com/vuejs/pinia/compare/pinia@2.0.28...pinia@2.0.29) (2023-01-15)

### Bug Fixes

- **types:** type storeToRefs getters as ComputedRef ([#1898](https://github.com/vuejs/pinia/issues/1898)) ([dcf7ef0](https://github.com/vuejs/pinia/commit/dcf7ef0d3a6773da97c5cdde4b9a958492a15d7d))

## [2.0.28](https://github.com/vuejs/pinia/compare/pinia@2.0.27...pinia@2.0.28) (2022-12-09)

### Bug Fixes

- avoid missing injection not found warn in edge Vue 2 edge case ([#1849](https://github.com/vuejs/pinia/issues/1849)) ([78ec9a1](https://github.com/vuejs/pinia/commit/78ec9a186dcbce3d583db332ae22094a182358cc)), closes [#1650](https://github.com/vuejs/pinia/issues/1650)

## [2.0.27](https://github.com/vuejs/pinia/compare/pinia@2.0.26...pinia@2.0.27) (2022-11-27)

- api docs changes

## [2.0.26](https://github.com/vuejs/pinia/compare/pinia@2.0.25...pinia@2.0.26) (2022-11-23)

### Bug Fixes

- **types:** support older ts versions ([78fb214](https://github.com/vuejs/pinia/commit/78fb21409b731f4822b076e83b31c234e75c722d)), closes [#1818](https://github.com/vuejs/pinia/issues/1818)

## [2.0.25](https://github.com/vuejs/pinia/compare/pinia@2.0.24...pinia@2.0.25) (2022-11-21)

### Bug Fixes

- **types:** implemented a workaround to be TS 4.9.x compatible ([#1818](https://github.com/vuejs/pinia/issues/1818)) ([c42a54c](https://github.com/vuejs/pinia/commit/c42a54c5d6bf20ca4b1c619da44f18be3c84db87))

## [2.0.24](https://github.com/vuejs/pinia/compare/pinia@2.0.23...pinia@2.0.24) (2022-11-17)

## [2.0.23](https://github.com/vuejs/pinia/compare/pinia@2.0.22...pinia@2.0.23) (2022-10-08)

### Bug Fixes

- **devtools:** init `_customProperties` for devtools ([#1704](https://github.com/vuejs/pinia/issues/1704)) ([8c1dfce](https://github.com/vuejs/pinia/commit/8c1dfce2e67c37e09251a7b85fcae2d6a4030fb8))

## [2.0.22](https://github.com/vuejs/pinia/compare/pinia@2.0.21...pinia@2.0.22) (2022-09-06)

### Features

- **ssr:** handle Maps and Sets ([f9843eb](https://github.com/vuejs/pinia/commit/f9843eb589ea9752f9021f9ebcfc49f6659350d2)), closes [#1608](https://github.com/vuejs/pinia/issues/1608)

## [2.0.21](https://github.com/vuejs/pinia/compare/pinia@2.0.20...pinia@2.0.21) (2022-08-26)

### Bug Fixes

- **build:** remove problematic browser export ([6efa780](https://github.com/vuejs/pinia/commit/6efa780f2c6e401e1d82a80a2aeceeac962f1c4e)), closes [#1593](https://github.com/vuejs/pinia/issues/1593)

## [2.0.20](https://github.com/vuejs/pinia/compare/pinia@2.0.19...pinia@2.0.20) (2022-08-19)

- **build**: support vue 2 devtools flag

## [2.0.19](https://github.com/vuejs/pinia/compare/pinia@2.0.18...pinia@2.0.19) (2022-08-18)

### Bug Fixes

- **devtools:** use flag to include devtools ([4e92c36](https://github.com/vuejs/pinia/commit/4e92c360a4b4b8a39b2e3c284f31560120742b6f))

## [2.0.18](https://github.com/vuejs/pinia/compare/pinia@2.0.17...pinia@2.0.18) (2022-08-10)

### Bug Fixes

- **ie:** completely skip devtools in dev for IE ([ca73db9](https://github.com/vuejs/pinia/commit/ca73db964b56205d43aa798e10d5c5bb5c4ea847)), closes [#1440](https://github.com/vuejs/pinia/issues/1440)

## [2.0.17](https://github.com/vuejs/pinia/compare/pinia@2.0.16...pinia@2.0.17) (2022-07-25)

### Bug Fixes

- **devtools:** state formatting ([b01f5c2](https://github.com/vuejs/pinia/commit/b01f5c2a5cb62cfd3e0df9da5570925f3a6f077a)), closes [#1358](https://github.com/vuejs/pinia/issues/1358)
- setupStore getter types ([#1430](https://github.com/vuejs/pinia/issues/1430)) ([#1444](https://github.com/vuejs/pinia/issues/1444)) ([6be93f2](https://github.com/vuejs/pinia/commit/6be93f2301a7711873f49c94999913947e3896b8))

### Features

- **devtools:** allow resetting fromp pinia inspector ([cee0e16](https://github.com/vuejs/pinia/commit/cee0e16e0ea343f97fa6b96f80ff32380637110b))

## [2.0.16](https://github.com/vuejs/pinia/compare/pinia@2.0.15...pinia@2.0.16) (2022-07-12)

### Bug Fixes

- add missing require in exports ([96c0dbc](https://github.com/vuejs/pinia/commit/96c0dbc66ee166e6bd11be60c8486f239d83af40))

## [2.0.15](https://github.com/vuejs/pinia/compare/pinia@2.0.14...pinia@2.0.15) (2022-07-11)

### Features

- warn when a getter conflicts with the state ([#1356](https://github.com/vuejs/pinia/issues/1356)) ([667b81d](https://github.com/vuejs/pinia/commit/667b81dfd7888bbae562bbd02c3670d4c664a8e2))

## [2.0.14](https://github.com/vuejs/pinia/compare/pinia@2.0.13...pinia@2.0.14) (2022-05-05)

### Bug Fixes

- avoid multiple subscriptions with empty promises ([6c17168](https://github.com/vuejs/pinia/commit/6c17168b03307f257491dbd6c0962d5bfade02cc)), closes [#1129](https://github.com/vuejs/pinia/issues/1129)
- correctly detect option stores ([11b92fd](https://github.com/vuejs/pinia/commit/11b92fd9e4b1d2402df79de9fc47c32c1b9ce726)), closes [#1272](https://github.com/vuejs/pinia/issues/1272)
- **devtools:** remove in tests environment ([4aeb0a5](https://github.com/vuejs/pinia/commit/4aeb0a539f7389a628e6c32bb6849ce3cd50cc17))

## [2.0.13](https://github.com/vuejs/pinia/compare/pinia@2.0.12...pinia@2.0.13) (2022-03-31)

### Bug Fixes

- avoid prototype pollution ([e4858f9](https://github.com/vuejs/pinia/commit/e4858f9d5f447ba6162ca9f2472608a8bac3eca7))
- **vue2:** use toRefs in storeToRefs ([0f24ad2](https://github.com/vuejs/pinia/commit/0f24ad27f16bd473e20a8671cd24877d2603cbcf)), closes [#852](https://github.com/vuejs/pinia/issues/852)

### Features

- update devtools-api ([5334222](https://github.com/vuejs/pinia/commit/53342222c536b0dc122f491525ca1c5ad8d25a05))

## [2.0.12](https://github.com/vuejs/pinia/compare/pinia@2.0.11...pinia@2.0.12) (2022-03-14)

### Bug Fixes

- **devtools:** avoid error in getters ([a64c19d](https://github.com/vuejs/pinia/commit/a64c19d33ed60dac1b1c1f98cf2055615a45f6d8)), closes [#1062](https://github.com/vuejs/pinia/issues/1062)
- **types:** exclude internal properties from store ([f8f944f](https://github.com/vuejs/pinia/commit/f8f944fcdd4411c2f84297786955c4c157fbeebe)), closes [#1013](https://github.com/vuejs/pinia/issues/1013)

### Features

- **devtools:** allow disable logs ([43f690f](https://github.com/vuejs/pinia/commit/43f690f10c35b2c309cd091225379afc0479ad93))
- **devtools:** use api.now() ([836ab86](https://github.com/vuejs/pinia/commit/836ab865b48f09df5dc848e69ad14597cbaaf21e))
- up vue-devtools ([e8e5f28](https://github.com/vuejs/pinia/commit/e8e5f28e08a37ed1d30e680df95ce6f3307775ed))
- **warn:** avoid vue 2 bug storeToRefs() ([f692fdf](https://github.com/vuejs/pinia/commit/f692fdfe623389f3d85c90e5a923c5cfb15c0b0b)), closes [#852](https://github.com/vuejs/pinia/issues/852)

## [2.0.11](https://github.com/vuejs/pinia/compare/pinia@2.0.10...pinia@2.0.11) (2022-01-30)

### Bug Fixes

- **types:** custom Awaited for TS 4.x ([7fcb62e](https://github.com/vuejs/pinia/commit/7fcb62e6fc77e273daf5396d68a9b17126d3ea35)), closes [#1006](https://github.com/vuejs/pinia/issues/1006)

## [2.0.10](https://github.com/vuejs/pinia/compare/pinia@2.0.9...pinia@2.0.10) (2022-01-27)

### Bug Fixes

- check HTMLAnchorElement in saveAs for mini-program ([#966](https://github.com/vuejs/pinia/issues/966)) ([#967](https://github.com/vuejs/pinia/issues/967)) ([85daefb](https://github.com/vuejs/pinia/commit/85daefb7c3325d3cd258de9812cb117c393b8f99))
- **subscriptions:** allow removing subscriptions inside them ([#990](https://github.com/vuejs/pinia/issues/990)) ([465d222](https://github.com/vuejs/pinia/commit/465d22292a0086eb610f5f83edd64a795eba329b))
- **types:** custom Awaited for TS 4.x ([7c51126](https://github.com/vuejs/pinia/commit/7c51126d5b59b0c1a693df7c4a93bd4cf309b79b)), closes [#957](https://github.com/vuejs/pinia/issues/957)

## [2.0.9](https://github.com/vuejs/pinia/compare/pinia@2.0.8...pinia@2.0.9) (2021-12-24)

### Features

- **types:** support IDE features for store context ([#924](https://github.com/vuejs/pinia/issues/924)) ([4733f49](https://github.com/vuejs/pinia/commit/4733f49c5af400aea7d3d1002265f9cdebcdd222))

## [2.0.8](https://github.com/vuejs/pinia/compare/pinia@2.0.7...pinia@2.0.8) (2021-12-20)

### Bug Fixes

- **subscribe:** avoid $subscriptions with $patch ([3bfe9e5](https://github.com/vuejs/pinia/commit/3bfe9e51fd0f9b3f939aace53463aa10f2e9c90f)), closes [#908](https://github.com/vuejs/pinia/issues/908)

## [2.0.7](https://github.com/vuejs/pinia/compare/pinia@2.0.6...pinia@2.0.7) (2021-12-20)

### Bug Fixes

- allow using multiple `$onAction`, **ignore returned value** ([4dc1f1b](https://github.com/vuejs/pinia/commit/4dc1f1bec8f3db508c02fa6bdcc8203f280cbb3e)), closes [#893](https://github.com/vuejs/pinia/issues/893)
- **subscribe:** direct mutation should not trigger detached subscriptions ([a9ef6b6](https://github.com/vuejs/pinia/commit/a9ef6b6c96ae8fdf891e29ab05c5276773425e1c)), closes [#908](https://github.com/vuejs/pinia/issues/908)

### Features

- update devtools-api ([ca26686](https://github.com/vuejs/pinia/commit/ca266868c5c5a00f3bebb326e9a0b9aaf90fb344))

## [2.0.6](https://github.com/vuejs/pinia/compare/pinia@2.0.5...pinia@2.0.6) (2021-12-04)

### Bug Fixes

- downgrade peerdep requirement for ts ([100a60d](https://github.com/vuejs/pinia/commit/100a60d648e246cbc67ffe63105e1a5b3bcb9b44)), closes [#874](https://github.com/vuejs/pinia/issues/874)

## [2.0.5](https://github.com/vuejs/pinia/compare/pinia@2.0.4...pinia@2.0.5) (2021-12-01)

### Bug Fixes

- accept reactive with storeToRefs ([3a2a334](https://github.com/vuejs/pinia/commit/3a2a334110dadb94cc1dddc10bd7673aa79b358f)), closes [#799](https://github.com/vuejs/pinia/issues/799)
- shouldHydrate if not in skipHydrateMap ([#846](https://github.com/vuejs/pinia/issues/846)) ([bcc44bc](https://github.com/vuejs/pinia/commit/bcc44bcedf2f127cf0218db4a89bb16b028a4ffc))

## [2.0.4](https://github.com/vuejs/pinia/compare/pinia@2.0.3...pinia@2.0.4) (2021-11-19)

### Features

- **devtools:** allow resetting directly from devtools ([44fa896](https://github.com/vuejs/pinia/commit/44fa896213e855bb611e30f25b9cd7ffe4a1643e))
- **devtools:** display all getters in pinia root ([ce8f1e5](https://github.com/vuejs/pinia/commit/ce8f1e5b87fa21c09b044be965e34d48b50a129b))

## [2.0.3](https://github.com/vuejs/pinia/compare/pinia@2.0.2...pinia@2.0.3) (2021-11-10)

- Updated peer deps for composition api and vue devtools

## [2.0.2](https://github.com/vuejs/pinia/compare/pinia@2.0.1...pinia@2.0.2) (2021-11-03)

### Bug Fixes

- **types:** for devtools-api ([d856d5d](https://github.com/vuejs/pinia/commit/d856d5df5d8e7402749d0dc135a349e84f5c9e9d))
- **types:** remove dependency on Vue 3 only Plugin type ([ee358a6](https://github.com/vuejs/pinia/commit/ee358a6428bf1f34e7c00415be56da9aecc739b0))

## [2.0.1](https://github.com/vuejs/pinia/compare/pinia@2.0.0...pinia@2.0.1) (2021-11-03)

This release correctly removes the deprecated APIs as advertised in v2. The [documentation](https://pinia.vuejs.org/cookbook/migration-v1-v2.html) contains a list of all the deprecations compared to v0.x.

### Bug Fixes

- use assign instead of spread for older browsers ([51cf9b6](https://github.com/vuejs/pinia/commit/51cf9b6e5a61d668a5e27b5e02833607ad0b5907))

### Features

- **warn:** improve getActivePinia warn ([6a0a209](https://github.com/vuejs/pinia/commit/6a0a209faf42b149bcda1dd373e0b1e5bf426ce4))

# [2.0.0](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.15...pinia@2.0.0) (2021-10-27)

🎉 🎉 🎉

### Bug Fixes

- **devtools:** root store access [#732](https://github.com/vuejs/pinia/issues/732) ([90d2c35](https://github.com/vuejs/pinia/commit/90d2c35d94ccb6e3991b99b181bfe3b360cfa289))
- **plugins:** ensure plugins are used only once ([#745](https://github.com/vuejs/pinia/issues/745)) ([150fdfc](https://github.com/vuejs/pinia/commit/150fdfc8abe2577046af947b2e4fbbde2efb057e))
- **ssr:** make skipHydrate compatible with @vue/composition-api ([71448b0](https://github.com/vuejs/pinia/commit/71448b008fc4517ab0036b98121a0346df75880e))

### BREAKING CHANGES

All deprecated API have been removed.

# [2.0.0-rc.15](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.14...pinia@2.0.0-rc.15) (2021-10-25)

### Bug Fixes

- **types:** remove unused option hydrate for setup stores ([37d07fb](https://github.com/vuejs/pinia/commit/37d07fb29ef2885d94cae3b3f212cea83772a073))

### Code Refactoring

- **ssr:** pass storeState instead of store to hydrate ([c85edac](https://github.com/vuejs/pinia/commit/c85edacefc8c69a54e84afbcd577b8d1027b3065))

### Features

- **ssr:** add skipHydrate to skip hydration on specific refs ([55deedb](https://github.com/vuejs/pinia/commit/55deedbc492a26ab98d96ed40ddfdf6ebac45aae))

### BREAKING CHANGES

- **ssr:** the `hydrate()` option for stores defined with the
  options api no longers passes the whole store instance. Instead, it
  passes the `storeState` so it can be directly modified. This is because
  it was currently necessary to hydrate the store by setting properties
  onto `store.$state`. This change makes it impossible to make the mistake
  anymore.

```diff
 defineStore('main', {
   state: () => ({
     customRef: useLocalStorage('key', 0)
   }),
-  hydrate(store) {
-    store.$state.customRef = useLocalStorage('key', 0)
+  hydrate(storeState) {
+    storeState.customRef = useLocalStorage('key', 0)
   }
 })
```

# [2.0.0-rc.14](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.13...pinia@2.0.0-rc.14) (2021-10-19)

Readme update

# [2.0.0-rc.13](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.12...pinia@2.0.0-rc.13) (2021-10-12)

- bump vue-devtools-api version

# [2.0.0-rc.12](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.11...pinia@2.0.0-rc.12) (2021-10-07)

### Features

- proper check of computed requiring @vue/composition-api@1.2.3 ([b099ef4](https://github.com/vuejs/pinia/commit/b099ef4ee143ba9cf44e08c1eb607de395563020))
- **warn:** log store id with class constructor warning ([#702](https://github.com/vuejs/pinia/issues/702)) ([39eee6a](https://github.com/vuejs/pinia/commit/39eee6a48b5d84f916e90b513024e26e9c6d72c5))

# [2.0.0-rc.11](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.10...pinia@2.0.0-rc.11) (2021-10-03)

### Bug Fixes

- **build:** expose mjs correctly ([2e9fe33](https://github.com/vuejs/pinia/commit/2e9fe33647f9b649e53841ec54f0df048835c1ba))
- export the module version in mjs ([cffc313](https://github.com/vuejs/pinia/commit/cffc3134ec4d44c7a0a1492d942d44dc5d838df1))
- **types:** correctly type global extensions ([cdbdba5](https://github.com/vuejs/pinia/commit/cdbdba5153198cde6b678cb96ab7948b351fd3cc)), closes [#630](https://github.com/vuejs/pinia/issues/630)
- **warn:** avoid toRefs warning for Vue 2 ([c174fe1](https://github.com/vuejs/pinia/commit/c174fe1dfa48569b1fc9e04f105832ab9a8e3824)), closes [#648](https://github.com/vuejs/pinia/issues/648)

# [2.0.0-rc.10](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.9...pinia@2.0.0-rc.10) (2021-09-30)

### Bug Fixes

- **ssr:** always call setActivePinia ([83d7d2f](https://github.com/vuejs/pinia/commit/83d7d2f4cabedf9c65ba90f2e18882261c49f71f)), closes [#665](https://github.com/vuejs/pinia/issues/665)
- use assign to set $state ([f3a732f](https://github.com/vuejs/pinia/commit/f3a732f86fbd0399f7b7ebc6a762a2425d08bb4c)), closes [#682](https://github.com/vuejs/pinia/issues/682)
- fix mjs, cjs versions for webpack based builds

### Features

- **warn:** incorrect state value [#641](https://github.com/vuejs/pinia/issues/641) ([#646](https://github.com/vuejs/pinia/issues/646)) ([6fd3883](https://github.com/vuejs/pinia/commit/6fd3883100ccc5c11668c3b855ff0660dd8af9fe))

# [2.0.0-rc.9](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.8...pinia@2.0.0-rc.9) (2021-09-12)

### Bug Fixes

- correct store in getters vue 2 ([3d4080b](https://github.com/vuejs/pinia/commit/3d4080b503292f1d711daa51fad204c5f8db223d))
- **vue2:** delay getters until stores are ready when cross using them ([ed48b00](https://github.com/vuejs/pinia/commit/ed48b0093c2a58caf8bb4548cceb13eeaf5f1378))
- **vue2:** fix isComputed check for getters ([307078b](https://github.com/vuejs/pinia/commit/307078bb7a485ec01ff50fdcd58138433662ade0))

# [2.0.0-rc.8](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.7...pinia@2.0.0-rc.8) (2021-09-06)

### Bug Fixes

- correctly set the store properties in Vue 2 ([9e40309](https://github.com/vuejs/pinia/commit/9e40309e5bfc54f5f71178cf90d37ebcf8dd8dca)), closes [#657](https://github.com/vuejs/pinia/issues/657)

# [2.0.0-rc.7](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.6...pinia@2.0.0-rc.7) (2021-09-03)

### Bug Fixes

- **ssr:** properly hydrate setup stores ([4fbacfc](https://github.com/vuejs/pinia/commit/4fbacfcd87362515902e3f98fd53a51a39216b9f))

### Features

- add typedoc ([b98e23d](https://github.com/vuejs/pinia/commit/b98e23d5588925c6a0094a92067a3cc5784e965d))
- allow stores to be cross used ([cda3658](https://github.com/vuejs/pinia/commit/cda365875c599e9786ab3479d42e8e6b3bb0fc23))
- deprecate PiniaPlugin in favor of PiniaVuePlugin ([c0495c0](https://github.com/vuejs/pinia/commit/c0495c0fe5710894ff04009f1f136cfb4d9241c4))
- support TS 4.4 ([#656](https://github.com/vuejs/pinia/issues/656)) ([39b2e15](https://github.com/vuejs/pinia/commit/39b2e15c0a2782280bd0de44230d2f3dc624b3c6))

# [2.0.0-rc.6](https://github.com/vuejs/pinia/compare/pinia@2.0.0-rc.5...pinia@2.0.0-rc.6) (2021-08-19)

Fix missing types.

# [2.0.0-rc.5](https://github.com/vuejs/pinia/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2021-08-19)

### Bug Fixes

- **ssr:** convert hydrated state to refs ([3f186a2](https://github.com/vuejs/pinia/commit/3f186a28e954cd4ccb48e4f26448a96cb0a0d7e1)), closes [#619](https://github.com/vuejs/pinia/issues/619)

### Features

- destroy a store with $dispose ([#597](https://github.com/vuejs/pinia/issues/597)) ([a563e6a](https://github.com/vuejs/pinia/commit/a563e6abd1e58e6bf810987dd520f754987c32d8))
- expose getActivePinia ([8b8d0c1](https://github.com/vuejs/pinia/commit/8b8d0c17958e3b4e2d9bc809c78a28931d1b00f0))
- **testing:** add testing package ([fc05376](https://github.com/vuejs/pinia/commit/fc053763752c2b11d7b851f95334034a1f9b8347))

# [2.0.0-rc.4](https://github.com/vuejs/pinia/compare/v2.0.0-rc.3...v2.0.0-rc.4) (2021-08-09)

If you are using Vue 2, make sure your `@vue/composition-api` version is at least `1.1.0`, which is currently under the npm dist tag `next`, which means it has to be installed with `npm install @vue/composition-api@next`.

### Bug Fixes

- **types:** unwrap computed in store getters ([35d4f59](https://github.com/vuejs/pinia/commit/35d4f591cf48166466f4d4e414de8063d55e3811)), closes [#602](https://github.com/vuejs/pinia/issues/602) [#603](https://github.com/vuejs/pinia/issues/603)

# [2.0.0-rc.3](https://github.com/vuejs/pinia/compare/v2.0.0-rc.2...v2.0.0-rc.3) (2021-08-05)

### Bug Fixes

- set initial state in prod ([f8e3c83](https://github.com/vuejs/pinia/commit/f8e3c83a4c7be7bf537a5d6ffca97408263bc9a0)), closes [#598](https://github.com/vuejs/pinia/issues/598)

# [2.0.0-rc.2](https://github.com/vuejs/pinia/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2021-08-04)

This version supports Vue 2! [Here](https://github.com/vuejs/pinia-vue-2-vite-example) is an example using Vue 2 and Vite for an optimal DX. **Note this version requires Vue Devtools 6**, and more specifically, they don't work with the current `@vue/devtools-api` (`6.0.0-beta.15`) because they require [this unreleased fix](https://github.com/vuejs/devtools/commit/3db47027d81c1701d2ddfe1dd86bae0d7ce63cef). To get all the goodness pinia has to offer **for Vue 2**, you will need to clone `vuejs/devtools`, run `yarn && yarn run build` and then _load an unpacked extension_ on a Chromium browser (after activating the developer mode in the extension panel). If you are using Vue 3, you can still use the Vue Devtools 6 regularly.

### Bug Fixes

- **devtools:** grouping of actions ([3d760f1](https://github.com/vuejs/pinia/commit/3d760f1c78936666174c1a352314081bccf11b01))
- **devtools:** reflect changes on HMR ([aebc9a0](https://github.com/vuejs/pinia/commit/aebc9a0969bec40c06b28f96ff0d1d048f589f31))

### Features

- add support for Vue 2 ([e1ea1c8](https://github.com/vuejs/pinia/commit/e1ea1c8563816dd99963aae778c03335d0577266))
- enable devtools with Vue 2 ([08cdff5](https://github.com/vuejs/pinia/commit/08cdff5be7415f8c635fe9431cb32931950e5fcb))

# [2.0.0-rc.1](https://github.com/vuejs/pinia/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2021-07-30)

Posted <https://github.com/vuejs/pinia/issues/592> to help people installing or upgrading Pinia.

### Bug Fixes

- collect reactive effects ran in plugins ([54cee00](https://github.com/vuejs/pinia/commit/54cee009cf15a5086ad031da65278a7689230587))
- **devtools:** update when custom properties change ([7dcb71e](https://github.com/vuejs/pinia/commit/7dcb71e8182900c451a56f1ad9e0e931dba48dcb))
- **store:** keep original refs with $reset ([a7dadff](https://github.com/vuejs/pinia/commit/a7dadfff8aae4abb83696a47904b030295408a09)), closes [#593](https://github.com/vuejs/pinia/issues/593)

# [2.0.0-rc.0](https://github.com/vuejs/pinia/compare/v2.0.0-beta.5...v2.0.0-rc.0) (2021-07-28)

## Required Vue version ‼️

This release requires Vue 3.2.0, which is currently only available under the `beta` dist tag (`npm i vue@beta` or `yarn add vue@beta` + the corresponding packages like `@vue/compiler-sfc@beta`).

Follow the instructions at <https://github.com/vuejs/pinia/issues/592> if you need help updating your package versions.

It contains major improvements:

- Performance: Pinia now uses `effectScope()`, effectively reducing memory consumption and removing the drawbacks mentioned in the Plugin section about `useStore()` creating multiple store instances (still sharing the state).
- Devtools: Many improvements over the information displayed in devtools as well as a few bugfixes
- HMR (Hot Module Replacement): You can now modify your stores without reloading the page and losing the state, making development much easier. Until 3.2.0 (stable) is released, you can find an example [in the playground](https://github.com/vuejs/pinia/blob/2b98eafe441ea7e9a3ff3cef122c24eb5fa03f1d/playground/src/stores/counter.ts#L66-L68). After that, you can read up to date instructions [in the documentation](https://pinia.vuejs.org/cookbook/hot-module-replacement.html).
- Setup syntax: You can now define stores with a function instead of options. This enables more complex patterns. See an example [in the playground](https://github.com/vuejs/pinia/blob/75f1fe6aa4ef2629ae1c9840a2d4542ac6e62686/playground/src/stores/jokes-swrv.ts). Setup Stores are unable to group actions like Option Stores due to their very permissive syntax.
- Option syntax: we can now pass the `id` as the first parameter. This syntax is preferred over the object syntax to be consistent with the Setup syntax.

### Bug Fixes

- avoid modifying options argument ([59ac9b9](https://github.com/vuejs/pinia/commit/59ac9b962778f730ade9c2a8b1a575922957d907))
- **devtools:** avoid grouping patches and mutations with finished actions ([18a87fe](https://github.com/vuejs/pinia/commit/18a87fe260317c679732d0ec271c036b9806448f))
- **errors:** allow async errors to propagate ([17ee4e8](https://github.com/vuejs/pinia/commit/17ee4e85fb2c084ba27730dae4f21683686156c6)), closes [#576](https://github.com/vuejs/pinia/issues/576)
- **ssr:** delay getters read ([2f3bd53](https://github.com/vuejs/pinia/commit/2f3bd5330e853b8ef11b6364a3a86e780c5f309f))
- **types:** actual generic store ([e4c541f](https://github.com/vuejs/pinia/commit/e4c541fdd17ea97e25dfd45bd3378732ff6a344d))
- **types:** stricter types for mapState ([f702356](https://github.com/vuejs/pinia/commit/f702356a5549dfe184c4d3805757c494a7088b19))

### Features

- allow actions to be destructured ([859d094](https://github.com/vuejs/pinia/commit/859d094bd993f4714093af17182ed73dd98659c5))
- **devtools:** display pinia without stores ([ca59257](https://github.com/vuejs/pinia/commit/ca59257a4ca3a37f54d6b9690a2ceedbc545dedd))
- **devtools:** show hot update in timeline ([3b9ed17](https://github.com/vuejs/pinia/commit/3b9ed1777621b1c8c0f781f5c974357da042c6e7))
- **types:** add StorState, StoreGetters, and StoreActions helpers ([47c0610](https://github.com/vuejs/pinia/commit/47c06101555328b6ca24e2f574f8f402b3bf1675))

### BREAKING CHANGES

- **types:** The existing `Store<Id, S, G, A>` types was trying to be generic when no types were specified but failing at it. Now, `Store` without any type will default to an empty Store. This enables a stricter version of `defineStore` when any of state, getters, and actions are missing. If you were using `Store` as a type, you should now use `StoreGeneric` instead, which also replaces `GenericStore` (marked as deprecated).

```diff
-function takeAnyStore(store: Store) {}
+function takeAnyStore(store: StoreGeneric) {}
```

- **types** The existing `DefineStoreOptions` is no longer the one that should be extended to add custom options unless you only want them to be applied to Option Stores. Use `DefineStoreOptionsBase` instead.

# [2.0.0-beta.5](https://github.com/vuejs/pinia/compare/v2.0.0-beta.3...v2.0.0-beta.5) (2021-07-10)

### Bug Fixes

- **devtools:** avoid infinite loop when cross using stores ([55c651d](https://github.com/vuejs/pinia/commit/55c651d714a7d4083e4ef6369e3b5ab5dbf02182)), closes [#541](https://github.com/vuejs/pinia/issues/541)
- **devtools:** avoid warning ([399a930](https://github.com/vuejs/pinia/commit/399a93002b9b3627e636af191e64a7b56f82d2db))
- **types:** forbid non existant access in getters and actions ([2ee058e](https://github.com/vuejs/pinia/commit/2ee058ef0264dddb367c53ce534f832bdb7b5fb0))

### Features

- mark testing as internal ([18c8ed6](https://github.com/vuejs/pinia/commit/18c8ed6769f0313cdcf6139027c6162e973c8e89))
- **testing:** add createTestingPinia ([120ac9d](https://github.com/vuejs/pinia/commit/120ac9d98eca0e11f24c5334022ef9bc805371af))
- **testing:** allow stubing $patch ([10bef8a](https://github.com/vuejs/pinia/commit/10bef8ab2fa951fbaab0afe38b58a1396f23db8b))
- **testing:** allows faking an app ([0d00a27](https://github.com/vuejs/pinia/commit/0d00a2734fa11d8a4fad6c9fb796f8c9c3a25f83))
- **testing:** bypass useStore(pinia) ([5a52fb3](https://github.com/vuejs/pinia/commit/5a52fb33a1799e145a8d3e3423105247bb6980e7))

### Performance Improvements

- use esm version of file-saver ([49d1e38](https://github.com/vuejs/pinia/commit/49d1e38a808edbf58970ec2d47a1342d9a5229a1))

# [2.0.0-beta.3](https://github.com/vuejs/pinia/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2021-06-18)

### Bug Fixes

- **patch:** avoid merging reactive objects ([a6a75e8](https://github.com/vuejs/pinia/commit/a6a75e891d3fc4a7ec2c5dea3ac8081cf460c4d2)), closes [#528](https://github.com/vuejs/pinia/issues/528)

### Features

- **devtools:** display custom properties ([fd901cd](https://github.com/vuejs/pinia/commit/fd901cdf34d035289067a189a874b7e2df1cbe3e))

# [2.0.0-beta.2](https://github.com/vuejs/pinia/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-06-03)

### Bug Fixes

- **devtools:** register stores ([5fcca78](https://github.com/vuejs/pinia/commit/5fcca788c1da61f2a406e2924fca3a8bed51b667))

# [2.0.0-beta.1](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.19...v2.0.0-beta.1) (2021-06-03)

### Bug Fixes

- **types:** fix extension for TS 4.3 ([aff5c1e](https://github.com/vuejs/pinia/commit/aff5c1e6fb5c559d3cae103a3049046ee97ce3c0))

### Features

- remove deprecated APIs ([239aec5](https://github.com/vuejs/pinia/commit/239aec50f270bc9025b1c28490dbdfbc720ab9d5))
- **devtools:** add root state ([a75be78](https://github.com/vuejs/pinia/commit/a75be78e0d189d324c5f30ececb27cd1a61e7e77))
- **devtools:** import/export global state ([b969f2a](https://github.com/vuejs/pinia/commit/b969f2a9884d0794733aea1162e0c154b34dee26))
- **devtools:** load/save state ([9b503d6](https://github.com/vuejs/pinia/commit/9b503d6c81f45864eba299a20cfd2ec957c6884b))

# [2.0.0-alpha.19](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.18...v2.0.0-alpha.19) (2021-05-20)

### Bug Fixes

- **devtools:** use older js ([e35da3b](https://github.com/vuejs/pinia/commit/e35da3be7a753ab5e4b1692395cf86cf0c314ba9))

# [2.0.0-alpha.18](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2021-05-17)

### Bug Fixes

- **types:** correct subtype Store ([48523da](https://github.com/vuejs/pinia/commit/48523da371ac291689b7a62b9ec433894a595827)), closes [#500](https://github.com/vuejs/pinia/issues/500)
- **types:** export types ([befc132](https://github.com/vuejs/pinia/commit/befc132bace0b6fdc063d25db20549faa51e50b7))

# [2.0.0-alpha.17](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2021-05-17)

### Bug Fixes

- **types:** forbid non existent keys on store ([e747cba](https://github.com/vuejs/pinia/commit/e747cba7d90ebd9ef29a379d441744aecc31db80))
- **types:** patch should unwrap refs ([b82eafc](https://github.com/vuejs/pinia/commit/b82eafc9e11ae820d5185359526d19dbbff0fa75))
- **types:** unwrap refs passed to state ([b2d3ac9](https://github.com/vuejs/pinia/commit/b2d3ac994f0d1778d82fd0e5b14915fee4c5cb2b)), closes [#491](https://github.com/vuejs/pinia/issues/491)

### Features

- **devtools:** add more data to actions ([e8f4b0e](https://github.com/vuejs/pinia/commit/e8f4b0e95192ec7d10d380776e7e9e703fe31261))
- **devtools:** allow editing state ([0bbbd69](https://github.com/vuejs/pinia/commit/0bbbd69db467d168770571ec0452630ff6409741))
- **devtools:** allow editing stores from components ([b808fbc](https://github.com/vuejs/pinia/commit/b808fbcac9915d11f5979e1781ce125327a0e6ab))
- **devtools:** display only relevant stores ([58f0af6](https://github.com/vuejs/pinia/commit/58f0af617b6516f69024cecb95ef8e0dd665104f))
- **devtools:** group action and their changes ([ecd993a](https://github.com/vuejs/pinia/commit/ecd993abfcec2e95d63fe5ccfd64080d5c89cc0b))
- **types:** allow defining custom state properties ([17fcbca](https://github.com/vuejs/pinia/commit/17fcbcafd30eec3af609bcc4549eee08968ea1a2))
- **types:** infer args and returned value for onAction ([f3b3bcf](https://github.com/vuejs/pinia/commit/f3b3bcf52a8ba86bc0927f98f53045842905c216))
- subscribe to actions with `$onAction` ([c9ce6ea](https://github.com/vuejs/pinia/commit/c9ce6ea55f225351bb95a47890f791134b233aad)), closes [#240](https://github.com/vuejs/pinia/issues/240)

### Performance Improvements

- **devtools:** avoid multiple subscriptions ([ea62f1d](https://github.com/vuejs/pinia/commit/ea62f1db8d82224ea0226fa5ec90da410ff31bda))

### BREAKING CHANGES

- The `type` property of the first parameter of `store.$subscribe()` has slightly changed. **In most scenarios this shouldn't affect you** as the possible values for `type` were including emojis (a bad decision...) and they are now using an enum without emojis. Emojis are used only in devtools to give a mental hint regarding the nature and origin of different events in the timeline.

- In `store.$subscribe()`'s first argument, the `storeName` property has been deprecated in favor of `storeId`.

# [2.0.0-alpha.16](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.14...v2.0.0-alpha.16) (2021-05-04)

### Bug Fixes

- **devtools:** add all stores ([2a8515c](https://github.com/vuejs/pinia/commit/2a8515cef57dce9cb9d0d8f7a8a52bbc1d3b6082)), closes [#472](https://github.com/vuejs/pinia/issues/472)

### Features

- **devtools:** display getters in components ([810b969](https://github.com/vuejs/pinia/commit/810b9697fe639070c21a76119d7d7001b6db069e))

# [2.0.0-alpha.15](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2021-05-04)

### Bug Fixes

- **devtools:** fix devtools attach ([017795a](https://github.com/vuejs/pinia/commit/017795aac3e654d6c67f99437851dcfe589d20b0))

# [2.0.0-alpha.14](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2021-05-03)

### Features

- **devtools:** work with stores added before app.use ([#444](https://github.com/vuejs/pinia/issues/444)) ([21f917f](https://github.com/vuejs/pinia/commit/21f917f057522b7e2ff70fa8517c5941c644a577))
- **devtools:** add getters to devtools ([c4bf761](https://github.com/vuejs/pinia/commit/c4bf761e95b79a0831061e490ba1d69802bc9d95))
- mark getters as readonly ([fcbeb95](https://github.com/vuejs/pinia/commit/fcbeb95cdd7f2b7d58731392d707183b311863ff))
- **plugins:** allow chaining ([3a49d34](https://github.com/vuejs/pinia/commit/3a49d34f5d30c1d346243df0d043a0709b2a4861))
- **mapHelpers:** warn on array mapStores ([d385bd9](https://github.com/vuejs/pinia/commit/d385bd98b136be15b6aa3ac6c2c8ca9261af4635))
- pass options to context in plugins ([c8ad19f](https://github.com/vuejs/pinia/commit/c8ad19f6a959751d456aca93cd670d6b18064d50))
- **types:** expose PiniaPluginContext ([94d12e7](https://github.com/vuejs/pinia/commit/94d12e7f127125c8aa915262471e07aae9d881bf))
- add plugin api wip ([50bc807](https://github.com/vuejs/pinia/commit/50bc807dce932c5cbe02612505535f05dfe6325a))
- **plugins:** allow void return ([5ef7140](https://github.com/vuejs/pinia/commit/5ef71407764384bef13a4f46fd001beade387d24))
- **plugins:** pass a context object to plugins instead of app ([bcb4ec3](https://github.com/vuejs/pinia/commit/bcb4ec3422635dd57f655e58f72a9a7a1c7dba0d))
- add plugin api wip ([b5c928d](https://github.com/vuejs/pinia/commit/b5c928da20efc532de84d8b8498d56f306a40e03))

### Performance Improvements

- **store:** reuse store instances when possible ([14f5a5f](https://github.com/vuejs/pinia/commit/14f5a5fd21677e7e5673443c35eeadbe2bdd8f05))

### BREAKING CHANGES

- **store:** getters now receive the state as their first argument and it's properly typed so you can write getters with arrow functions:

  ```js
  defineStore({
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
    },
  })
  ```

  To access other getters, you must still use the syntax that uses `this` **but it is now necessary to explicitly type the getter return type**. The same limitation exists in Vue for computed properties and it's a known limitation in TypeScript:

  ```ts
  defineStore({
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
      // the `: number` is necessary when accessing `this` inside of
      // a getter
      doublePlusOne(state): number {
        return this.double + 1
      },
    },
  })
  ```

  For more information, refer to [the updated documentation for getters](https://pinia.vuejs.org/core-concepts/getters.html).

- **plugins:** To improve the plugin api capabilities, `pinia.use()`
  now receives a context object instead of just `app`:

  ```js
  // replace
  pinia.use((app) => {})
  // with
  pinia.use(({ app }) => {})
  ```

  Check the new documentation for [Plugins](https://pinia.vuejs.org/core-concepts/plugins.html)!

# [2.0.0-alpha.13](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2021-04-10)

### Bug Fixes

- **subscribe:** remove subscription when unmounted ([10e1c30](https://github.com/vuejs/pinia/commit/10e1c3069a23f3a9c0d1e32cbc1fbb074709173e))

### Features

- **types:** fail on async patch ([c254a8a](https://github.com/vuejs/pinia/commit/c254a8abc73d7e2589acbffe432a33f985c1003d))

# [2.0.0-alpha.12](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2021-04-09)

### Bug Fixes

- **store:** avoid multiple subscriptions call ([71404cb](https://github.com/vuejs/pinia/commit/71404cb3ef6466c74b72c5fdb1075740a788a309)), closes [#429](https://github.com/vuejs/pinia/issues/429) [#430](https://github.com/vuejs/pinia/issues/430)

# [2.0.0-alpha.11](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2021-04-09)

### Bug Fixes

- **types:** enable autocomplete in object ([b299ff0](https://github.com/vuejs/pinia/commit/b299ff070101dc9d17ceb24bd43d697033695167))

### Features

- mapWritableState ([3218bdb](https://github.com/vuejs/pinia/commit/3218bdbb916049bebf1416cef1c103ecda66274b))
- **mapState:** accept functions ([e2f2b92](https://github.com/vuejs/pinia/commit/e2f2b92f41f1908bfa6614655e625cbfcae5a716))
- **mapStores:** allow custom suffix ([c957fb9](https://github.com/vuejs/pinia/commit/c957fb97f1b1ffdb927f40dfa0abd0304a8eb998))
- **types:** allow extending mapStores suffix ([f14c7b9](https://github.com/vuejs/pinia/commit/f14c7b996dd8232370033c671566c4cafdf535bc))
- add mapActions ([b5d27fb](https://github.com/vuejs/pinia/commit/b5d27fbd34b006ae7aec01c091d4e246c3fa73fc))
- add mapStores ([d3d9327](https://github.com/vuejs/pinia/commit/d3d9327918081feaffe63b7debf4e5dbbcf55890))
- mapState with array ([0e05811](https://github.com/vuejs/pinia/commit/0e058113668f8c9a81d09e7175d89ea921142c31))
- mapState with object ([06805db](https://github.com/vuejs/pinia/commit/06805db9b4526cc0741016e0632cd6fb353a9728))
- **types:** expose DefineStoreOptions ([c727070](https://github.com/vuejs/pinia/commit/c72707070a5096df62a4bab269ce9087e2d9c102))

# [2.0.0-alpha.10](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2021-04-01)

### Features

- **patch:** allow passing a function ([8d545e4](https://github.com/vuejs/pinia/commit/8d545e427c6415df00254eb9638116e96e64d3b5))
- **types:** generics on PiniaCustomProperties ([36129cf](https://github.com/vuejs/pinia/commit/36129cf415abb8efccda859cd6b787594fe46f00))

# [2.0.0-alpha.9](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2021-03-31)

### Bug Fixes

- **types:** pass custom properties to stores ([d26df6e](https://github.com/vuejs/pinia/commit/d26df6e1133fc8dff58312df36ff2af6f129a560))

# [2.0.0-alpha.8](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2021-03-29)

### Bug Fixes

- use assign instead of spread ([b2bb5ba](https://github.com/vuejs/pinia/commit/b2bb5ba4faf52c41479a7d77490b85016b853229))
- **cjs:** ensure dev checks on cjs build ([a255735](https://github.com/vuejs/pinia/commit/a255735211b796120d5f76470ea18759f1eb5d97))

### Features

- **devtools:** logo and titles ([0963fd0](https://github.com/vuejs/pinia/commit/0963fd0b647b0e5414782f78167c770cbab24a83))

# [2.0.0-alpha.7](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2021-01-21)

### Bug Fixes

- resilient _VUE_DEVTOOLS_TOAST_ ([#334](https://github.com/vuejs/pinia/issues/334)) ([c0cacd2](https://github.com/vuejs/pinia/commit/c0cacd2631d76d9d6de2b16d4106ad7decb51217))

### Features

- enable calling `useStore()` in client ([c949b80](https://github.com/vuejs/pinia/commit/c949b80391cae322f024b8cc369be351d5d6a693))
- store plugins ([f027bf5](https://github.com/vuejs/pinia/commit/f027bf587b37c7fc30eba4da5f90d52d99e6536d))

# [2.0.0-alpha.6](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2020-12-31)

### Bug Fixes

- correct lifespan of stores ([483335c](https://github.com/vuejs/pinia/commit/483335c6660d593cf33468c1ab8c95da82cc392a)), closes [#255](https://github.com/vuejs/pinia/issues/255)

### Features

- **types:** export used types ([dc56fba](https://github.com/vuejs/pinia/commit/dc56fbafa21d8efa2a4b61ffb464f1befa25e34c)), closes [#315](https://github.com/vuejs/pinia/issues/315)

### BREAKING CHANGES

- `setActiveReq()` has been renamed to
  `setActivePinia()`. And now receives the application's pinia as the
  first parameter instead of an arbitrary object (like a Node http
  request). **This affects particularly users doing SSR** but also
  enables them to write universal code.

# [2.0.0-alpha.5](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2020-10-09)

### Code Refactoring

- prefix store properties with \$ ([#254](https://github.com/vuejs/pinia/issues/254)) ([751f286](https://github.com/vuejs/pinia/commit/751f2867b97f210488eb82bad1ec05af6ab6e72c))

### BREAKING CHANGES

- all store properties (`id`, `state`, `patch`, `subscribe`, and `reset`) are now prefixed with `$` to allow properties defined with the same type and avoid types breaking. Tip: you can refactor your whole codebase with F2 (or right-click + Refactor) on each of the store's properties

# [2.0.0-alpha.4](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2020-09-29)

### Bug Fixes

- detach stores creation from currentInstance ([dc31736](https://github.com/vuejs/pinia/commit/dc317360ebebc208ca31d819953c573f6a7ac3cc))

# [2.0.0-alpha.3](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2020-09-28)

### Code Refactoring

- rename createStore to defineStore ([a9ad160](https://github.com/vuejs/pinia/commit/a9ad160bb38d6bfae3a52c66ae28793937af05d6))

### Features

- deprecation message createStore ([3054251](https://github.com/vuejs/pinia/commit/30542514389e4b903e7726039b98324afdafcc24))
- **ssr:** support ssr ([59709e0](https://github.com/vuejs/pinia/commit/59709e0851db66d337054e3aab0db987fab20f9d))

### BREAKING CHANGES

- renamed `createStore` to `defineStore`. `createStore`
  will be marked as deprecated during the alpha releases and then be
  dropped.

# [2.0.0-alpha.2](https://github.com/vuejs/pinia/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2020-09-25)

### Features

- add devtools support ([849cb3f](https://github.com/vuejs/pinia/commit/849cb3f30559e312bf00625a42a7b697c68d9941))

# [2.0.0-alpha.1](https://github.com/vuejs/pinia/compare/0.1.0-alpha.1...2.0.0-alpha.1) (2020-09-22)

### Features

- access the state and getters through `this` ([#190](https://github.com/vuejs/pinia/issues/190)) ([6df18ef](https://github.com/vuejs/pinia/commit/6df18ef49472b0348b09cb84801c9c69ae79b3d9))
- merge all properties under this ([d5eaac1](https://github.com/vuejs/pinia/commit/d5eaac106c50be8febc25083839e7cb635ccfda7))

### BREAKING CHANGES

- `state` properties no longer need to be accessed through `store.state`
- `getters` no longer receive parameters, access the store instance via `this`:
  directly call `this.myState` to read state and other getters. **Update 2021-04-02**: `getters` receive the state again as the first parameter
