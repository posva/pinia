import { createStore, setActiveReq } from '../src'

describe('Getters', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
      getters: {
        upperCaseName() {
          return this.name.toUpperCase()
        },
        doubleName() {
          return this.upperCaseName
        },
        composed() {
          return this.upperCaseName + ': ok'
        },
        // TODO: I can't figure out how to pass `this` as an argument. Not sure
        // it is possible in this specific scenario
        // upperCaseNameArrow: store => store.name,
      },
    })()
  }

  const useB = createStore({
    id: 'B',
    state: () => ({ b: 'b' }),
  })

  const useA = createStore({
    id: 'A',
    state: () => ({ a: 'a' }),
    getters: {
      fromB() {
        const bStore = useB()
        return this.a + ' ' + bStore.b
      },
    },
  })

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName).toBe('EDUARDO')
    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('supports changing between requests', () => {
    const req1 = {}
    const req2 = {}
    setActiveReq(req1)
    const aStore = useA()

    // simulate a different request
    setActiveReq(req2)
    const bStore = useB()
    bStore.b = 'c'

    aStore.a = 'b'
    expect(aStore.fromB).toBe('b b')
  })

  it('can use other getters', () => {
    const store = useStore()
    expect(store.composed).toBe('EDUARDO: ok')
    store.name = 'Ed'
    expect(store.composed).toBe('ED: ok')
  })
})
