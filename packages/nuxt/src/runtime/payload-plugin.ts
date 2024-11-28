import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from '#imports'
import {} from 'nuxt/app'
import { shouldHydrate } from 'pinia'

/**
 * Removes properties marked with `skipHydrate()` to avoid sending unused data to the client.
 */
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    'skipHydrate',
    // We need to return something truthy to be treated as a match
    (data: unknown) => !shouldHydrate(data) && 1
  )
  definePayloadReviver('skipHydrate', (_data: 1) => undefined)
})

export default payloadPlugin
