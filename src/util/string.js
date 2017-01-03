export function camelize (s) {
  return s.replace(/(-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))
}

export function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}