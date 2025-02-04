import { MutationType, StoreGeneric } from '../types'
import { DebuggerEvent } from 'vue'
import { Pinia } from '../rootStore'
import { isPinia } from './utils'

// types from devtools-api
interface StateBase {
  key: string
  value: any
  editable?: boolean
  objectType?: 'ref' | 'reactive' | 'computed' | 'other'
  raw?: string
}
interface ComponentStateBase extends StateBase {
  type: string
}
type ComponentBuiltinCustomStateTypes =
  | 'function'
  | 'map'
  | 'set'
  | 'reference'
  | 'component'
  | 'component-definition'
  | 'router'
  | 'store'
interface CustomState {
  _custom: {
    type: ComponentBuiltinCustomStateTypes | string
    objectType?: string
    display?: string
    tooltip?: string
    value?: any
    abstract?: boolean
    file?: string
    uid?: number
    readOnly?: boolean
    /** Configure immediate child fields */
    fields?: {
      abstract?: boolean
    }
    id?: any
    actions?: {
      icon: string
      tooltip?: string
      action: () => void | Promise<void>
    }[]
    /** internal */
    _reviveId?: number
  }
}
interface ComponentPropState extends ComponentStateBase {
  meta?: {
    type: string
    required: boolean
    /** Vue 1 only */
    mode?: 'default' | 'sync' | 'once'
  }
}
type ComponentState =
  | ComponentStateBase
  | ComponentPropState
  | ComponentCustomState
interface ComponentCustomState extends ComponentStateBase {
  value: CustomState
}

interface InspectorNodeTag {
  label: string
  textColor: number
  backgroundColor: number
  tooltip?: string
}
interface CustomInspectorNode {
  id: string
  label: string
  children?: CustomInspectorNode[]
  tags?: InspectorNodeTag[]
  name?: string
  file?: string
}

interface CustomInspectorState {
  [key: string]: (StateBase | Omit<ComponentState, 'type'>)[]
}

export function formatDisplay(display: string) {
  return {
    _custom: {
      display,
    },
  }
}

export const PINIA_ROOT_LABEL = '🍍 Pinia (root)'
export const PINIA_ROOT_ID = '_root'

export function formatStoreForInspectorTree(
  store: StoreGeneric | Pinia
): CustomInspectorNode {
  return isPinia(store)
    ? {
        id: PINIA_ROOT_ID,
        label: PINIA_ROOT_LABEL,
      }
    : {
        id: store.$id,
        label: store.$id,
      }
}

export function formatStoreForInspectorState(
  store: StoreGeneric | Pinia
): CustomInspectorState {
  if (isPinia(store)) {
    const storeNames = Array.from(store._s.keys())
    const storeMap = store._s
    const state: CustomInspectorState = {
      state: storeNames.map((storeId) => ({
        editable: true,
        key: storeId,
        value: store.state.value[storeId],
      })),
      getters: storeNames
        .filter((id) => storeMap.get(id)!._getters)
        .map((id) => {
          const store = storeMap.get(id)!

          return {
            editable: false,
            key: id,
            value: store._getters!.reduce(
              (getters, key) => {
                getters[key] = store[key]
                return getters
              },
              {} as Record<string, any>
            ),
          }
        }),
    }

    return state
  }

  const state: CustomInspectorState | ComponentCustomState = {
    state: Object.keys(store.$state).map((key) => ({
      editable: true,
      key,
      value: store.$state[key],
    })),
  }

  // avoid adding empty getters
  if (store._getters && store._getters.length) {
    state.getters = store._getters.map((getterName) => ({
      editable: false,
      key: getterName,
      value: store[getterName],
    }))
  }

  if (store._customProperties.size) {
    state.customProperties = Array.from(store._customProperties).map((key) => ({
      editable: true,
      key,
      value: store[key],
    }))
  }

  return state
}

export function formatEventData(
  events: DebuggerEvent[] | DebuggerEvent | undefined
) {
  if (!events) return {}
  if (Array.isArray(events)) {
    // TODO: handle add and delete for arrays and objects
    return events.reduce(
      (data, event) => {
        data.keys.push(event.key)
        data.operations.push(event.type)
        data.oldValue[event.key] = event.oldValue
        data.newValue[event.key] = event.newValue
        return data
      },
      {
        oldValue: {} as Record<string, any>,
        keys: [] as string[],
        operations: [] as string[],
        newValue: {} as Record<string, any>,
      }
    )
  } else {
    return {
      operation: formatDisplay(events.type),
      key: formatDisplay(events.key),
      oldValue: events.oldValue,
      newValue: events.newValue,
    }
  }
}

export function formatMutationType(type: MutationType): string {
  switch (type) {
    case MutationType.direct:
      return 'mutation'
    case MutationType.patchFunction:
      return '$patch'
    case MutationType.patchObject:
      return '$patch'
    default:
      return 'unknown'
  }
}
