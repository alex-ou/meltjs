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

export function uniqueId () {
  var date = Date.now()

  // If created at same millisecond as previous
  if (date <= uniqueId.previous) {
    date = ++uniqueId.previous
  } else {
    uniqueId.previous = date
  }

  return date
}

uniqueId.previous = 0

export function range (start, stop, step) {
  if (typeof stop === 'undefined') {
    stop = start
    start = 0
  }

  if (typeof step === 'undefined') {
    step = 1
  }

  let index = -1
  let length = Math.max(Math.ceil((stop - start) / (step || 1)), 0)
  let result = Array(length)

  while (length--) {
    result[++index] = start
    start += step
  }
  return result
}
