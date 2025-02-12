import { describe, it, expect } from 'vitest'
import { formatStateDifferences, realTypeOf } from '../../src/devtools/utils'

describe('Devtools utils', () => {
  describe('realTypeOf', () => {
    it('Should correctly predict type of subject', () => {
      const number = 0
      const string = 'undefined'
      const undefinedValue = undefined
      const nullValue = null
      const array: any[] = []
      const date = new Date(123)
      const object = {}
      const regexp = /regexp/
      const functionValue = () => {}

      let type = realTypeOf(number)

      expect(type).toEqual('number')

      type = realTypeOf(string)

      expect(type).toEqual('string')

      type = realTypeOf(undefinedValue)

      expect(type).toEqual('undefined')

      type = realTypeOf(nullValue)

      expect(type).toEqual('null')

      type = realTypeOf(array)

      expect(type).toEqual('array')

      type = realTypeOf(date)

      expect(type).toEqual('date')

      type = realTypeOf(object)

      expect(type).toEqual('object')

      type = realTypeOf(regexp)

      expect(type).toEqual('regexp')

      type = realTypeOf(functionValue)

      expect(type).toEqual('function')
    })
  })

  describe('formatStateDifferences', () => {
    it('Should find removed entries', () => {
      const oldState = {
        removed: 'old',
      }
      const newState = {}

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        removed: undefined,
      })
    })

    it('Should find difference in array', () => {
      const oldState = {
        changedArray1: [1, 2, 3],
        unchangedArray: [1, 2, 3],
        changedArray2: [1, 2, 3],
      }
      const newState = {
        changedArray1: [1, 2, 3, 4],
        unchangedArray: [1, 2, 3],
        changedArray2: [3, 2, 1],
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedArray1: [1, 2, 3, 4],
        changedArray2: [3, 2, 1],
      })
    })

    it('Should find difference in regexp', () => {
      const oldState = {
        changedRegexp: /changed/,
        unchangedRegexp: /unchanged/,
      }
      const newState = {
        changedRegexp: /changedToNewValue/,
        unchangedRegexp: /unchanged/,
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedRegexp: /changedToNewValue/,
      })
    })

    it('Should find difference in date', () => {
      const oldState = {
        changedDate: new Date(123),
        unchangedDate: new Date(123),
      }
      const newState = {
        changedDate: new Date(1234),
        unchangedDate: new Date(123),
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedDate: new Date(1234),
      })
    })

    it('Should find difference in booleans', () => {
      const oldState = {
        changedBool: true,
        unchangedBool: true,
      }
      const newState = {
        changedBool: false,
        unchangedBool: true,
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedBool: false,
      })
    })

    it('Should find difference in numbers', () => {
      const oldState = {
        changedNumber: 10,
        unchangedNumber: 10,
      }
      const newState = {
        changedNumber: 9,
        unchangedNumber: 10,
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedNumber: 9,
      })
    })

    it('Should find difference in strings', () => {
      const oldState = {
        changedString: 'changed',
        unchangedString: 'unchanged',
      }
      const newState = {
        changedString: 'changedToNewValue',
        unchangedString: 'unchanged',
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedString: 'changedToNewValue',
      })
    })

    it('Should find new values', () => {
      const oldState = {}
      const newState = {
        newValue: 10,
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        newValue: 10,
      })
    })

    it('Should correctly see changes deep in objects', () => {
      const oldState = {
        changedObject: {
          key1: 'unchanged',
          key2: {
            key1: {
              key1: {
                key1: false,
                key2: true,
              },
            },
          },
          key3: {
            key1: {
              key1: {},
            },
            key2: {
              key1: 'abc',
            },
          },
          key4: 50,
        },
      }
      const newState = {
        changedObject: {
          key1: 'unchanged',
          key2: {
            key1: {
              key1: {
                key1: true,
                key2: true,
              },
            },
          },
          key3: {
            key1: {
              key1: {},
            },
            key2: {
              key1: 'abcd',
            },
          },
          key4: 50,
        },
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        changedObject: {
          key2: {
            key1: {
              key1: {
                key1: true,
              },
            },
          },
          key3: {
            key2: {
              key1: 'abcd',
            },
          },
        },
      })
    })

    it('Should find the difference between functions', () => {
      const foo = () => {}
      const bar = () => {}
      const foobar = () => {}

      const oldState = {
        foo,
        bar,
      }

      const newState = {
        foo: foobar,
        bar,
      }

      const differences = formatStateDifferences(oldState, newState)

      expect(differences).toEqual({
        foo: foobar,
      })
    })
  })
})
