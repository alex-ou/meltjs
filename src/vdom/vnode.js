import {isNull, isString, isNumber} from '../util/index'
/**
 * This function lets us create virtual nodes using a simple syntax.
 *
 * let node = h('div', { id: 'foo' }, [
 *   h('a', { href: 'http://google.com' },
 *     h('span', {}, 'Google'),
 *     h('b', {}, 'Link')
 *   )
 * ])
 */

export default class VNode {
  constructor (type, tagName, attrs, children, options) {
    this.type = type
    if (type === VNode.Text) {
      this.nodeValue = tagName
    } else if (type === VNode.Element) {
      this.tagName = tagName
    } else if (type === VNode.Thunk) {
      // render function
      this.renderFn = tagName
    }

    attrs = attrs || {}
    if (isString(attrs.key) || isNumber(attrs.key)) {
      this.key = attrs.key
    }
    delete attrs.key

    this.attrs = attrs
    this.children = children || []

    // Options for the component
    this.options = options
  }

  isText () {
    return this.type === VNode.Text
  }

  isEmpty () {
    return this.type === VNode.Empty
  }

  isElement () {
    return this.type === VNode.Element
  }

  isThunk () {
    return this.type === VNode.Thunk
  }
}

VNode.Text = 'text'
VNode.Element = 'element'
VNode.Empty = 'empty'
VNode.Thunk = 'thunk'

/**
 * Group an array of virtual elements by their key, using index as a fallback.
 */
export function groupByKey (children) {
  return children.map((child, i) => {
    let key = isNull(child) ? i : (child.key || i)
    return {
      key: String(key),
      item: child,
      index: i
    }
  })
}

