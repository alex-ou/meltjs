import {isNull, isString, isNumber, extend} from '../util/index'
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
  constructor (settings) {
    extend(this, {
      children: [],
      options: {}
    }, settings)

    let attrs = settings.attrs || {}
    if (isString(attrs.key) || isNumber(attrs.key)) {
      this.key = attrs.key
    }
    delete attrs.key

    this.attrs = attrs
  }

  isSameType (vnode) {
    return this.type === vnode.type
  }

  isElement () {
    return this.type === VNode.Element
  }

  isText () {
    return this.type === VNode.Text
  }

  isThunk () {
    return this.type === VNode.Thunk
  }
}

VNode.Text = 'text'
VNode.Element = 'element'
VNode.Empty = 'empty'
VNode.Thunk = 'thunk'

export function renderThunk (vnode) {
  let data = {
    props: vnode.attrs,
    children: vnode.children
  }
  let renderedVnode
  if (!vnode.options.render) {
    // the stateless function will get props through function params
    renderedVnode = vnode.renderFn(data)
  } else {
    // the component will get props through this.props
    extend(data, vnode.options)
    renderedVnode = vnode.renderFn.apply(data)
  }
  return renderedVnode
}

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

