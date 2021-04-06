import {
  createPinia,
  defineStore,
  mapGetters,
  mapState,
  mapStores,
  PiniaPlugin,
} from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import VueCompositionAPI, {
  nextTick,
  defineComponent,
} from '@vue/composition-api'

describe('Map Helpers', () => {
  const useCartStore = defineStore({ id: 'cart' })
  const useStore = defineStore({
    id: 'main',
    state: () => ({
      a: true,
      n: 0,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }),
    getters: {
      double() {
        return this.n * 2
      },
      notA() {
        return !this.a
      },
    },
    actions: {
      doubleCount() {
        this.n = this.n * 2
      },
    },
  })

  const localVue = createLocalVue()
  localVue.use(VueCompositionAPI)
  localVue.use(PiniaPlugin)

  describe('mapStores', () => {
    it('mapStores computes only once when mapping one store', async () => {
      const pinia = createPinia()
      const fromStore = jest.fn(function () {
        // @ts-ignore
        return this.mainStore
      })
      const Component = defineComponent({
        template: `<p @click="fromStore.n++">{{ fromStore.n }}</p>`,
        computed: {
          ...mapStores(useStore),
          fromStore,
        },
      })

      const wrapper = mount(Component, { localVue, pinia })
      // const store = useStore()
      // const other = useCartStore()
      expect(wrapper.vm.mainStore).toBeDefined()
      expect(wrapper.text()).toBe('0')
      await nextTick()
      expect(fromStore).toHaveBeenCalledTimes(1)

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1')
      expect(fromStore).toHaveBeenCalledTimes(1)
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2')
      expect(fromStore).toHaveBeenCalledTimes(1)
    })

    it('mapStores computes only once when mapping multiple stores', async () => {
      const pinia = createPinia()
      const fromStore = jest.fn(function () {
        // @ts-ignore
        return this.mainStore
      })
      const Component = defineComponent({
        template: `<p @click="fromStore.n++">{{ mainStore.n }} {{ fromStore.n }} {{ cartStore.$id }}</p>`,
        computed: {
          ...mapStores(useStore, useCartStore),
          fromStore,
        },
      })

      const wrapper = mount(Component, { localVue, pinia })
      expect(wrapper.text()).toBe('0 0 cart')
      await nextTick()
      // NOTE: it seems to be the same as the number of stores, probably because
      // we use Vue.set
      expect(fromStore).toHaveBeenCalledTimes(2)

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1 1 cart')
      expect(fromStore).toHaveBeenCalledTimes(2)
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2 2 cart')
      expect(fromStore).toHaveBeenCalledTimes(2)
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

      const wrapper = mount(Component, { localVue, pinia })

      expect(wrapper.text()).toBe(expectedText)
    }

    it('array', async () => {
      await testComponent(
        mapState(useStore, ['n', 'a']),
        `{{ n }} {{ a }}`,
        `0 true`
      )
    })

    it('getters', async () => {
      await testComponent(
        mapState(useStore, ['double', 'notA', 'a']),
        `{{ a }} {{ notA }} {{ double }}`,
        `true false 0`
      )
    })
  })
})
