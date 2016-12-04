export * from './elements'

export function _toString (v) {
  return v == null ? '' : JSON.stringify(v)
}
