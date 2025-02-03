import {
  App,
  createApp,
  customRef,
  isReactive,
  isRef,
  isVue2,
  set,
  toRaw,
  triggerRef,
} from 'vue-demi'
import type { ComputedRef, WritableComputedRef } from 'vue-demi'
import {
  Pinia,
  PiniaPlugin,
  setActivePinia,
  createPinia,
  StateTree,
  _DeepPartial,
  PiniaPluginContext,
} from 'pinia'

export interface TestingOptions {
  /**
   * Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
   * allowing you to only set a few properties that are required in your test.
   */
  initialState?: StateTree

  /**
   * Plugins to be installed before the testing plugin. Add any plugins used in
   * your application that will be used while testing.
   */
  plugins?: PiniaPlugin[]

  /**
   * When set to false, actions are only spied, but they will still get executed. When
   * set to true, actions will be replaced with spies, resulting in their code
   * not being executed. Defaults to true. NOTE: when providing `createSpy()`,
   * it will **only** make the `fn` argument `undefined`. You still have to
   * handle this in `createSpy()`.
   */
  stubActions?: boolean

  /**
   * When set to true, calls to `$patch()` won't change the state. Defaults to
   * false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
   * argument `undefined`. You still have to handle this in `createSpy()`.
   */
  stubPatch?: boolean

  /**
   * When set to true, calls to `$reset()` won't change the state. Defaults to
   * false.
   */
  stubReset?: boolean

  /**
   * Creates an empty App and calls `app.use(pinia)` with the created testing
   * pinia. This allows you to use plugins while unit testing stores as
   * plugins **will wait for pinia to be installed in order to be executed**.
   * Defaults to false.
   */
  fakeApp?: boolean

  /**
   * Function used to create a spy for actions and `$patch()`. Pre-configured
   * with `jest.fn` in Jest projects or `vi.fn` in Vitest projects if
   * `globals: true` is set.
   */
  createSpy?: (fn?: (...args: any[]) => any) => (...args: any[]) => any
}

/**
 * Pinia instance specifically designed for testing. Extends a regular
 * `Pinia` instance with test specific properties.
 */
export interface TestingPinia extends Pinia {
  /** App used by Pinia */
  app: App
}

declare var vi:
  | undefined
  | {
      fn: (fn?: (...args: any[]) => any) => (...args: any[]) => any
    }

/**
 * Creates a pinia instance designed for unit tests that **requires mocking**
 * the stores. By default, **all actions are mocked** and therefore not
 * executed. This allows you to unit test your store and components separately.
 * You can change this with the `stubActions` option. If you are using jest,
 * they are replaced with `jest.fn()`, otherwise, you must provide your own
 * `createSpy` option.
 *
 * @param options - options to configure the testing pinia
 * @returns a augmented pinia instance
 */
export function createTestingPinia({
  initialState = {},
  plugins = [],
  stubActions = true,
  stubPatch = false,
  stubReset = false,
  fakeApp = false,
  createSpy: _createSpy,
}: TestingOptions = {}): TestingPinia {
  const pinia = createPinia()

  // allow adding initial state
  pinia._p.push(({ store }) => {
    if (initialState[store.$id]) {
      mergeReactiveObjects(store.$state, initialState[store.$id])
    }
  })

  // bypass waiting for the app to be installed to ensure the action stubbing happens last
  plugins.forEach((plugin) => pinia._p.push(plugin))

  // allow computed to be manually overridden
  pinia._p.push(WritableComputed)

  const createSpy =
    _createSpy ||
    // @ts-ignore
    (typeof jest !== 'undefined' && (jest.fn as typeof _createSpy)) ||
    (typeof vi !== 'undefined' && vi.fn)
  /* istanbul ignore if */
  if (!createSpy) {
    throw new Error(
      '[@pinia/testing]: You must configure the `createSpy` option. See https://pinia.vuejs.org/cookbook/testing.html#Specifying-the-createSpy-function'
    )
  } else if (
    typeof createSpy !== 'function' ||
    // When users pass vi.fn() instead of vi.fn
    // https://github.com/vuejs/pinia/issues/2896
    'mockReturnValue' in createSpy
  ) {
    throw new Error(
      '[@pinia/testing]: Invalid `createSpy` option. See https://pinia.vuejs.org/cookbook/testing.html#Specifying-the-createSpy-function'
    )
  }

  // stub actions
  pinia._p.push(({ store, options }) => {
    Object.keys(options.actions).forEach((action) => {
      if (action === '$reset') return
      store[action] = stubActions ? createSpy() : createSpy(store[action])
    })

    store.$patch = stubPatch ? createSpy() : createSpy(store.$patch)
    store.$reset = stubReset ? createSpy() : createSpy(store.$reset)
  })

  if (fakeApp) {
    const app = createApp({})
    app.use(pinia)
  }

  pinia._testing = true

  setActivePinia(pinia)

  Object.defineProperty(pinia, 'app', {
    configurable: true,
    enumerable: true,
    get(): App {
      return this._a
    },
  })

  return pinia as TestingPinia
}

function mergeReactiveObjects<T extends StateTree>(
  target: T,
  patchToApply: _DeepPartial<T>
): T {
  // no need to go through symbols because they cannot be serialized anyway
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key)) continue
    const subPatch = patchToApply[key]
    const targetValue = target[key]
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      target.hasOwnProperty(key) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      target[key] = mergeReactiveObjects(targetValue, subPatch)
    } else {
      if (isVue2) {
        set(target, key, subPatch)
      } else {
        // @ts-expect-error: subPatch is a valid value
        target[key] = subPatch
      }
    }
  }

  return target
}

function isPlainObject<S extends StateTree>(value: S | unknown): value is S
function isPlainObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: any
): o is StateTree {
  return (
    o &&
    typeof o === 'object' &&
    Object.prototype.toString.call(o) === '[object Object]' &&
    typeof o.toJSON !== 'function'
  )
}

function isComputed<T>(
  v: ComputedRef<T> | WritableComputedRef<T> | unknown
): v is ComputedRef<T> | WritableComputedRef<T> {
  return !!v && isRef(v) && 'effect' in v
}

function WritableComputed({ store }: PiniaPluginContext) {
  const rawStore = toRaw(store)
  for (const key in rawStore) {
    const originalComputed = rawStore[key]
    if (isComputed(originalComputed)) {
      const originalFn = originalComputed.effect.fn
      rawStore[key] = customRef((track, trigger) => {
        // override the computed with a new one
        const overriddenFn = () =>
          // @ts-expect-error: internal value
          originalComputed._value
        // originalComputed.effect.fn = overriddenFn
        return {
          get: () => {
            track()
            return originalComputed.value
          },
          set: (newValue) => {
            // reset the computed to its original value by setting it to its initial state
            if (newValue === undefined) {
              originalComputed.effect.fn = originalFn
              // @ts-expect-error: private api to remove the current cached value
              delete originalComputed._value
              // @ts-expect-error: private api to force the recomputation
              originalComputed._dirty = true
            } else {
              originalComputed.effect.fn = overriddenFn
              // @ts-expect-error: private api
              originalComputed._value = newValue
            }
            // this allows to trigger the original computed in setup stores
            triggerRef(originalComputed)
            trigger()
          },
        }
      })
    }
  }
}
