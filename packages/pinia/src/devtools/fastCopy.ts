// Clone deep utility for cloning state of the store
// Forked from https://github.com/planttheidea/fast-copy
// Last update: 24-08-2022

declare namespace FastCopy {
  export type Realm = Record<string, any>

  export interface Cache {
    _keys?: any[]
    _values?: any[]
    has: (value: any) => boolean
    set: (key: any, value: any) => void
    get: (key: any) => any
  }

  export type Copier = <Value = any>(value: Value, cache: Cache) => Value

  export type ObjectCloner = <Value>(
    object: Value,
    realm: Realm,
    handleCopy: Copier,
    cache: Cache
  ) => Value

  export type Options = {
    isStrict?: boolean
    realm?: Realm
  }
}

const { toString: toStringFunction } = Function.prototype
const {
  create,
  defineProperty,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getPrototypeOf,
} = Object

const SYMBOL_PROPERTIES = typeof getOwnPropertySymbols === 'function'
const WEAK_MAP = typeof WeakMap === 'function'

/**
 * @function createCache
 *
 * @description
 * get a new cache object to prevent circular references
 *
 * @returns the new cache object
 */
export const createCache = (() => {
  if (WEAK_MAP) {
    return (): FastCopy.Cache => new WeakMap()
  }

  class Cache {
    _keys: any[] = []
    _values: any[] = []

    has(key: any) {
      return !!~this._keys.indexOf(key)
    }

    get(key: any) {
      return this._values[this._keys.indexOf(key)]
    }

    set(key: any, value: any) {
      this._keys.push(key)
      this._values.push(value)
    }
  }

  return (): FastCopy.Cache => new Cache()
})()

/**
 * @function getCleanClone
 *
 * @description
 * get an empty version of the object with the same prototype it has
 *
 * @param object the object to build a clean clone from
 * @param realm the realm the object resides in
 * @returns the empty cloned object
 */
export const getCleanClone = (object: any, realm: FastCopy.Realm): any => {
  const prototype = object.__proto__ || getPrototypeOf(object)

  if (!prototype) {
    return create(null)
  }

  const Constructor = prototype.constructor

  if (Constructor === realm.Object) {
    return prototype === realm.Object.prototype ? {} : create(prototype)
  }

  if (~toStringFunction.call(Constructor).indexOf('[native code]')) {
    try {
      return new Constructor()
    } catch {}
  }

  return create(prototype)
}

/**
 * @function getObjectCloneStrict
 *
 * @description
 * get a copy of the object based on strict rules, meaning all keys and symbols
 * are copied based on the original property descriptors
 *
 * @param object the object to clone
 * @param realm the realm the object resides in
 * @param handleCopy the function that handles copying the object
 * @returns the copied object
 */
export const getObjectCloneStrict: FastCopy.ObjectCloner = (
  object: any,
  realm: FastCopy.Realm,
  handleCopy: FastCopy.Copier,
  cache: FastCopy.Cache
): any => {
  const clone: any = getCleanClone(object, realm)

  // set in the cache immediately to be able to reuse the object recursively
  cache.set(object, clone)

  const properties: (string | symbol)[] = SYMBOL_PROPERTIES
    ? getOwnPropertyNames(object).concat(
        getOwnPropertySymbols(object) as unknown as string[]
      )
    : getOwnPropertyNames(object)

  for (
    let index = 0, length = properties.length, property, descriptor;
    index < length;
    ++index
  ) {
    property = properties[index]

    if (property !== 'callee' && property !== 'caller') {
      descriptor = getOwnPropertyDescriptor(object, property)

      if (descriptor) {
        // Only clone the value if actually a value, not a getter / setter.
        if (!descriptor.get && !descriptor.set) {
          descriptor.value = handleCopy(object[property], cache)
        }

        try {
          defineProperty(clone, property, descriptor)
        } catch (error) {
          // Tee above can fail on node in edge cases, so fall back to the loose assignment.
          clone[property] = descriptor.value
        }
      } else {
        // In extra edge cases where the property descriptor cannot be retrived, fall back to
        // the loose assignment.
        clone[property] = handleCopy(object[property], cache)
      }
    }
  }

  return clone
}

/**
 * @function getRegExpFlags
 *
 * @description
 * get the flags to apply to the copied regexp
 *
 * @param regExp the regexp to get the flags of
 * @returns the flags for the regexp
 */
export const getRegExpFlags = (regExp: RegExp): string => {
  let flags = ''

  if (regExp.global) {
    flags += 'g'
  }

  if (regExp.ignoreCase) {
    flags += 'i'
  }

  if (regExp.multiline) {
    flags += 'm'
  }

  if (regExp.unicode) {
    flags += 'u'
  }

  if (regExp.sticky) {
    flags += 'y'
  }

  return flags
}

const { isArray } = Array

const GLOBAL_THIS: FastCopy.Realm = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }

  if (typeof self !== 'undefined') {
    return self
  }

  if (typeof window !== 'undefined') {
    return window
  }

  if (typeof global !== 'undefined') {
    return global
  }

  if (console && console.error) {
    console.error('Unable to locate global object, returning "this".')
  }

  // @ts-ignore
  return this
})()

/**
 * @function copy
 *
 * @description
 * copy an value deeply as much as possible
 *
 * If `strict` is applied, then all properties (including non-enumerable ones)
 * are copied with their original property descriptors on both objects and arrays.
 *
 * The value is compared to the global constructors in the `realm` provided,
 * and the native constructor is always used to ensure that extensions of native
 * objects (allows in ES2015+) are maintained.
 *
 * @param value the value to copy
 * @param [options] the options for copying with
 * @param [options.isStrict] should the copy be strict
 * @param [options.realm] the realm (this) value the value is copied from
 * @returns the copied value
 */
function copy<Value>(value: Value, options?: FastCopy.Options): Value {
  // manually coalesced instead of default parameters for performance
  const realm = (options && options.realm) || GLOBAL_THIS
  const getObjectClone = getObjectCloneStrict

  /**
   * @function handleCopy
   *
   * @description
   * copy the value recursively based on its type
   *
   * @param value the value to copy
   * @returns the copied value
   */
  const handleCopy: FastCopy.Copier = (
    value: any,
    cache: FastCopy.Cache
  ): any => {
    if (!value || typeof value !== 'object') {
      return value
    }

    if (cache.has(value)) {
      return cache.get(value)
    }

    const prototype = value.__proto__ || getPrototypeOf(value)
    const Constructor = prototype && prototype.constructor

    // plain objects
    if (!Constructor || Constructor === realm.Object) {
      return getObjectClone(value, realm, handleCopy, cache)
    }

    let clone: any

    // arrays
    if (isArray(value)) {
      return getObjectCloneStrict(value, realm, handleCopy, cache)
    }

    // dates
    if (value instanceof realm.Date) {
      return new Constructor(value.getTime())
    }

    // regexps
    if (value instanceof realm.RegExp) {
      clone = new Constructor(
        value.source,
        value.flags || getRegExpFlags(value)
      )

      clone.lastIndex = value.lastIndex

      return clone
    }

    // maps
    if (realm.Map && value instanceof realm.Map) {
      clone = new Constructor()
      cache.set(value, clone)

      value.forEach((value: any, key: any) => {
        clone.set(key, handleCopy(value, cache))
      })

      return clone
    }

    // sets
    if (realm.Set && value instanceof realm.Set) {
      clone = new Constructor()
      cache.set(value, clone)

      value.forEach((value: any) => {
        clone.add(handleCopy(value, cache))
      })

      return clone
    }

    // blobs
    if (realm.Blob && value instanceof realm.Blob) {
      return value.slice(0, value.size, value.type)
    }

    // buffers (node-only)
    if (realm.Buffer && realm.Buffer.isBuffer(value)) {
      clone = realm.Buffer.allocUnsafe
        ? realm.Buffer.allocUnsafe(value.length)
        : new Constructor(value.length)

      cache.set(value, clone)
      value.copy(clone)

      return clone
    }

    // arraybuffers / dataviews
    if (realm.ArrayBuffer) {
      // dataviews
      if (realm.ArrayBuffer.isView(value)) {
        clone = new Constructor(value.buffer.slice(0))
        cache.set(value, clone)
        return clone
      }

      // arraybuffers
      if (value instanceof realm.ArrayBuffer) {
        clone = value.slice(0)
        cache.set(value, clone)
        return clone
      }
    }

    // if the value cannot / should not be cloned, don't
    if (
      // promise-like
      typeof value.then === 'function' ||
      // errors
      value instanceof Error ||
      // weakmaps
      (realm.WeakMap && value instanceof realm.WeakMap) ||
      // weaksets
      (realm.WeakSet && value instanceof realm.WeakSet)
    ) {
      return value
    }

    // assume anything left is a custom constructor
    return getObjectClone(value, realm, handleCopy, cache)
  }

  return handleCopy(value, createCache())
}

/**
 * @function strictCopy
 *
 * @description
 * copy the value with `strict` option pre-applied
 *
 * @param value the value to copy
 * @param [options] the options for copying with
 * @param [options.realm] the realm (this) value the value is copied from
 * @returns the copied value
 */
copy.strict = function strictCopy(value: any, options?: FastCopy.Options) {
  return copy(value, {
    isStrict: true,
    realm: options ? options.realm : void 0,
  })
}

export default copy
