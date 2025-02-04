import { defineStore, expectType } from './'

const useStore = defineStore('main', {
  state: () => ({
    user: 'Eduardo',
  }),
  actions: {
    direct(name: string) {
      this.user = name
    },
    patchObject(user: string) {
      this.$patch({ user })
    },
    patchFn(name: string) {
      this.$patch((state) => {
        state.user = name
      })
    },
    async asyncUpperName() {
      return this.user.toUpperCase()
    },
    upperName() {
      return this.user.toUpperCase()
    },
    throws(e: any) {
      throw e
    },
    async rejects(e: any) {
      throw e
    },
  },
})

let store = useStore()

store.$onAction((context) => {
  expectType<{ user: string }>(context.store.$state)
  expectType<(name: string) => void>(context.store.direct)

  if (context.name === 'upperName') {
    expectType<[]>(context.args)
    context.after((ret) => {
      expectType<string>(ret)
    })
  } else if (context.name === 'asyncUpperName') {
    context.after((ret) => {
      expectType<string>(ret)
    })
  } else if (context.name === 'throws') {
    context.after((ret) => {
      expectType<never>(ret)
    })
    expectType<[any]>(context.args)
  } else if (context.name === 'direct') {
    expectType<[string]>(context.args)
  }
})
