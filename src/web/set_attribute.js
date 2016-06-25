import {isNumber, isString, isBoolean, isFunction} from '../util/index'
import events from './util/events'
import {removeEventListener, addEventListener, setAttribute as setNodeAttribute} from './node-op'

export function removeAttribute (node, name, oldValue) {
  let eventType = events[name]
  if (eventType && isFunction(oldValue)) {
    removeEventListener(node, eventType, oldValue)
    return
  }
  switch (name) {
    case 'checked':
    case 'disabled':
    case 'selected':
      node[name] = false
      break
    case 'innerHTML':
    case 'nodeValue':
    case 'value':
      node[name] = ''
      break
    default:
      node.removeAttribute(name)
      break
  }
}

export function setAttribute (node, name, value, oldValue) {
  let eventType = events[name]
  if (value === oldValue) {
    return
  }
  if (eventType) {
    if (isFunction(oldValue)) {
      removeEventListener(node, eventType, oldValue)
    }
    addEventListener(node, eventType, value)
    return
  }
  if (!isValidAttribute(value)) {
    removeAttribute(node, name, oldValue)
    return
  }
  switch (name) {
    case 'checked':
    case 'disabled':
    case 'innerHTML':
    case 'nodeValue':
      node[name] = value
      break
    case 'selected':
      node.selected = value
      // Fix for IE/Safari where select is not correctly selected on change
      if (node.tagName === 'OPTION' && node.parentNode) {
        let select = node.parentNode
        let options = Array.prototype.slice(select.options) || []
        select.selectedIndex = options.indexOf(node)
      }
      break
    case 'value':
      node.value = value
      break
    default:
      setNodeAttribute(node, name, value)
      break
  }
}

function isValidAttribute (value) {
  if (isNumber(value) || isString(value)) {
    return true
  }

  if (isBoolean(value)) {
    return value
  }

  return false
}
