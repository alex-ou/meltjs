const hasConsole = typeof console !== 'undefined'

export function warn (...args) {
  hasConsole && console.warn.apply(console, args)
}
export function error (...args) {
  hasConsole && console.error.apply(console, args)
}
