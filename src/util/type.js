/**
 * Check if string
 * @param  {Mixed}  value
 * @return {Boolean}
 */
export function isString (value) {
  return typeof value === 'string'
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

var hasOwn = Object.prototype.hasOwnProperty
export function has (prop, obj) {
  return hasOwn.call(obj, prop)
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isBoolean (value) {
  return typeof value === 'boolean'
}