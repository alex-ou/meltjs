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
  constructor (type, tagName, attrs, children) {
    this.type = type
    if (type === VNode.Text) {
      this.nodeValue = tagName
    } else {
      this.tagName = tagName
    }

    attrs = attrs || {}
    if (isString(attrs.key) || isNumber(attrs.key)) {
      this.key = attrs.key
    }
    delete attrs.key

    this.attrs = attrs
    this.children = children || []
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
}

VNode.Text = 'text'
VNode.Element = 'element'
VNode.Empty = 'empty'

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

