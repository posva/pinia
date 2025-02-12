import { defineStore, expectType } from './'

const useStore = defineStore('name', {
  state: () => ({ count: 0 }),
  actions: {
    useOtherAction() {
      return this.returnStuff()
    },
    useExternalFunction() {
      return outer(this as any)
    },
    returnStuff() {
      this.useOtherAction()
      return this.count * 2
    },
    // return type is necessary
    factorial(n?: number): number {
      n ??= this.count
      return n > 1 ? this.factorial(n - 1) * n : 1
    },
    crossA(): 'A' | 'B' {
      if (this.count < 3) {
        return 'A'
      } else {
        return this.crossB()
      }
    },
    crossB() {
      if (this.count > 2) {
        return this.crossA()
      } else {
        return 'B'
      }
    },
  },
})

function outer(store: ReturnType<typeof useStore>): number {
  return store.count * 2
}

const store = useStore()

expectType<'A' | 'B'>(store.crossA())
expectType<'A' | 'B'>(store.crossB())
expectType<number>(store.factorial())
expectType<number>(store.returnStuff())
expectType<number>(store.useExternalFunction())
expectType<number>(store.useOtherAction())
expectType<number>(outer(store))
