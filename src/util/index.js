export * from './debug'
export * from './type'
export * from './bitset'
export * from './string'

export function noop () {}

export function makeMap (str) {
  var obj = {}
  var items = str.split(',')
  for (var i = 0; i < items.length; i++) {
    obj[items[i]] = true
  }
  return obj
}
