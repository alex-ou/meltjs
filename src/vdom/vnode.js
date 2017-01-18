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
    /** settings include the following fields
     type
     tagName
     attributes,
     children
     */
    extend(this, {
      children: [],
      component: {}
    }, settings)

    let attributes = settings.attributes || {}
    if (isString(attributes.key) || isNumber(attributes.key)) {
      this.key = attributes.key
    }
    delete attributes.key

    this.attributes = attributes
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

export function renderThunk (vnode, context) {
  let data = {
    props: vnode.attributes,
    children: vnode.children
  }
  let renderedVnode
  if (!vnode.component.render) {
    // the stateless function will get props through function params
    // and it should not have access to the context
    renderedVnode = vnode.renderFn(data)
  } else {
    // the component will get props through this.props
    extend(vnode.component, data)
    renderedVnode = vnode.renderFn.call(vnode.component, context)
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

