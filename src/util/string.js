export function camelize (s) {
  return s.replace(/(-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))
}
