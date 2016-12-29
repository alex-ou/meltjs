/**
 * Check if string
 * @param  {Mixed}  value
 * @return {Boolean}
 */
const ObjProto = Object.prototype
const toString = ObjProto.toString
const nativeKeys = Object.keys

export function isString (value) {
  return typeof value === 'string' || value instanceof String
}

export function isNumber (value) {
  return typeof value === 'number'
}

export function isNull (value) {
  return value === null
}

export function isUndefined (value) {
  return typeof value === 'undefined'
}

export function isObject (value) {
  return isFunction(value) || (typeof value === 'object' && !!value)
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isBoolean (value) {
  return typeof value === 'boolean'
}

export const isArray = Array.isArray || function isArray (obj) {
  return toString.call(obj) === '[object Array]'
}

var hasOwn = ObjProto.hasOwnProperty
export function has (obj, prop) {
  return hasOwn.call(obj, prop)
}

export function getKeys (obj) {
  if (!isObject(obj)) return []

  if (nativeKeys) return nativeKeys(obj)

  var result = []
  for (let key in obj) {
    if (has(obj, key)) {
      result.push(key)
    }
  }
  return result
}

export function getValues (obj) {
  let result = []
  let keys = getKeys(obj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    if (has(obj, key)) {
      result.push(obj[key])
    }
  }
  return result
}

export function each (obj, func) {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      func(obj[i], i)
    }
  } else if (isObject(obj)) {
    let keys = getKeys(obj)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      func(obj[key], key, obj)
    }
  }
}

/**
 * Merge the contents of two or more objects together into the first object.
 * @param obj
 * @param sources
 * @returns {*}
 */
export function extend (obj, ...sources) {
  if (obj == null || sources.length === 0) {
    return obj
  }

  for (let i = 0; i < sources.length; i++) {
    let source = sources[i]
    let keys = getKeys(sources[i])
    for (let j = 0; j < keys.length; j++) {
      let key = keys[j]
      let value = source[key]
      if (isUndefined(value)) {
        continue
      }
      obj[key] = value
    }
  }
  return obj
}
