import { describe, it, expect } from 'vitest'
import {
  createPinia,
  defineStore,
  mapActions,
  mapGetters,
  mapState,
  mapStores,
  mapWritableState,
  setMapStoreSuffix,
} from '../src'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, ref, computed } from 'vue'
import { mockWarn } from './vitest-mock-warn'

describe('Map Helpers', () => {
  const useStore = defineStore('main', {
    state: () => ({
      a: true,
      n: 0,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }),
    getters: {
      double(state) {
        return state.n * 2
      },
      notA(state) {
        return !state.a
      },
    },
    actions: {
      doubleCount() {
        this.n = this.n * 2
      },
    },
  })

  describe('mapStores', () => {
    mockWarn()

    it('can set custom suffix', async () => {
      const pinia = createPinia()
      setMapStoreSuffix('')
      const Component = defineComponent({
        template: `<p @click="main.n++">{{ main.n }}</p>`,
        computed: {
          ...mapStores(useStore),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      // @ts-expect-error: by default this shouldn't exist
      expect(wrapper.vm.main).toBeDefined()
      expect(wrapper.vm.mainStore).not.toBeDefined()
      expect(wrapper.text()).toBe('0')
      await nextTick()

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1')
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2')
    })

    it('should warn when an array is passed', () => {
      mapStores([])
      expect('pass all stores to "mapStores()"').toHaveBeenWarned()
    })
  })

  it('mapGetters', () => {
    expect(mapGetters).toBe(mapState)
  })

  describe('mapState', () => {
    async function testComponent(
      computedProperties: any,
      template: string,
      expectedText: string
    ) {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p>${template}</p>`,
        computed: {
          ...computedProperties,
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.text()).toBe(expectedText)
    }

    it('array', async () => {
      await testComponent(
        mapState(useStore, ['n', 'a']),
        `{{ n }} {{ a }}`,
        `0 true`
      )
    })

    it('object', async () => {
      await testComponent(
        mapState(useStore, { count: 'n', myA: 'a' }),
        `{{ count }} {{ myA }}`,
        `0 true`
      )
    })

    it('object with functions', async () => {
      await testComponent(
        mapState(useStore, { triple: (state) => (state.n + 1) * 3, myA: 'a' }),
        `{{ triple }} {{ myA }}`,
        `3 true`
      )
    })

    it('uses component context', async () => {
      const pinia = createPinia()
      let vm
      const Component = defineComponent({
        template: `<p>{{ n }}</p>`,
        computed: {
          ...mapState(useStore, {
            n(store) {
              vm = this
              return store.n
            },
          }),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      expect(vm).toBe(wrapper.vm)
    })

    it('getters', async () => {
      await testComponent(
        mapState(useStore, ['double', 'notA', 'a']),
        `{{ a }} {{ notA }} {{ double }}`,
        `true false 0`
      )
    })
  })

  describe('mapActions', () => {
    const useStore = defineStore('main', {
      state: () => ({ n: 0 }),
      actions: {
        increment() {
          this.n++
        },
        setN(newN: number) {
          return (this.n = newN)
        },
      },
    })

    it('array', () => {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p></p>`,
        methods: {
          ...mapActions(useStore, ['increment', 'setN']),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.vm.increment()).toBe(undefined)
      expect(wrapper.vm.setN(4)).toBe(4)
    })

    it('object', () => {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p></p>`,
        methods: {
          ...mapActions(useStore, { inc: 'increment', set: 'setN' }),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.vm.inc()).toBe(undefined)
      expect(wrapper.vm.set(4)).toBe(4)
    })
  })

  describe('mapWritableState', () => {
    async function testComponent(
      computedProperties: any,
      template: string,
      expectedText: string,
      expectedText2: string
    ) {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p>${template}</p>`,
        computed: {
          ...computedProperties,
        },
        methods: Object.keys(computedProperties).reduce((methods, name) => {
          // @ts-ignore
          methods['set_' + name] = function (v: any) {
            // @ts-ignore
            this[name] = v
          }
          return methods
        }, {}),
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.text()).toBe(expectedText)

      for (const key in computedProperties) {
        // @ts-ignore
        wrapper.vm['set_' + key]('replaced')
      }

      await nextTick()

      expect(wrapper.text()).toBe(expectedText2)
    }

    it('array', async () => {
      await testComponent(
        mapWritableState(useStore, ['n', 'a']),
        `{{ n }} {{ a }}`,
        `0 true`,
        'replaced replaced'
      )
    })

    it('object', async () => {
      await testComponent(
        mapWritableState(useStore, { count: 'n', myA: 'a' }),
        `{{ count }} {{ myA }}`,
        `0 true`,
        'replaced replaced'
      )
    })

    it('setup store', async () => {
      const useSetupStore = defineStore('setup', () => {
        const text = ref('initial')

        const textUpper = computed({
          get: () => text.value.toUpperCase(),
          set: (v) => {
            text.value = v
          },
        })

        return { text, textUpper }
      })

      await testComponent(
        mapWritableState(useSetupStore, ['text', 'textUpper']),
        `{{ text }} {{ textUpper }}`,
        `initial INITIAL`,
        'replaced REPLACED'
      )
    })
  })
})
