import { Pinia } from '../rootStore'
import { StateTree } from '../types'

/**
 * Shows a toast or console.log
 *
 * @param message - message to log
 * @param type - different color of the tooltip
 */
export function toastMessage(
  message: string,
  type?: 'normal' | 'error' | 'warn' | undefined
) {
  const piniaMessage = '🍍 ' + message

  if (typeof __VUE_DEVTOOLS_TOAST__ === 'function') {
    // No longer available :(
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type)
  } else if (type === 'error') {
    console.error(piniaMessage)
  } else if (type === 'warn') {
    console.warn(piniaMessage)
  } else {
    console.log(piniaMessage)
  }
}

export function isPinia(o: any): o is Pinia {
  return '_a' in o && 'install' in o
}

export const realTypeOf = (subject: any) => {
  const type = typeof subject
  if (type !== 'object') return type

  if (subject === Math) {
    return 'math'
  } else if (subject === null) {
    return 'null'
  } else if (Array.isArray(subject)) {
    return 'array'
  } else if (Object.prototype.toString.call(subject) === '[object Date]') {
    return 'date'
  } else if (
    typeof subject.toString === 'function' &&
    /^\/.*\//.test(subject.toString())
  ) {
    return 'regexp'
  }
  return 'object'
}

export function formatStateDifferences(
  initialState: StateTree,
  newState: StateTree
): StateTree {
  const stateDifferences: StateTree = {}

  for (const key in newState) {
    const oldType = realTypeOf(initialState[key])
    const newType = realTypeOf(newState[key])

    if (oldType !== newType) {
      stateDifferences[key] = newState[key]
      continue
    }

    switch (newType) {
      case 'object':
        const oldHash = JSON.stringify(initialState[key])
        const newHash = JSON.stringify(newState[key])

        if (oldHash !== newHash) {
          const diffsInObject = formatStateDifferences(
            initialState[key],
            newState[key]
          )

          if (Object.keys(diffsInObject).length) {
            stateDifferences[key] = diffsInObject
          }
        }
        break
      case 'date':
        if (initialState[key] - newState[key] !== 0) {
          stateDifferences[key] = newState[key]
        }
        break
      case 'array':
      case 'regexp':
        if (initialState[key].toString() !== newState[key].toString()) {
          stateDifferences[key] = newState[key]
        }
        break
      default:
        if (initialState[key] !== newState[key]) {
          stateDifferences[key] = newState[key]
        }
    }
  }

  Object.keys(initialState).forEach((key) => {
    if (!(key in newState)) {
      stateDifferences[key] = undefined
    }
  })

  return stateDifferences
}
