import {isNull, isString, isNumber, extend, isFunction, isUndefined, each} from '../util/index'
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
      children: []
    }, settings)

    let attributes = settings.attributes || {}
    if (isString(attributes.key) || isNumber(attributes.key)) {
      this.key = attributes.key
    }
    delete attributes.key

    this.directives = attributes.directives
    delete attributes.directives

    this.attributes = attributes
    this.props = attributes
  }

  isSameType (vnode) {
    if (this.type !== vnode.type) {
      return false
    }
    if (!this.isThunk()) {
      return true
    }
    // check whether it's the same thunk or not
    // Stateless function component
    if (isFunction(this.component)) {
      return this.renderFn === vnode.renderFn
    }
    // Object style component
    if (!isUndefined(vnode.component.selector)) {
      return this.component.selector === vnode.component.selector
    }
    return this.component === vnode.component
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

  _callback (callbackName, ...args) {
    let receivers = this.component ? [this.component] : []
    if (this.directives) {
      receivers = receivers.concat(this.directives)
    }

    each(receivers, receiver => {
      let callback = receiver[callbackName]
      if (callback) {
        callback.apply(receiver, args)
      }
    })
  }

  onMount (domElem) {
    this.elem = domElem
    this._callback('onMount', this)
  }

  onUnmount () {
    this._callback('onUnmount', this)
  }

  onUpdate (domElem, oldVnode) {
    this.elem = domElem
    this._callback('onUpdate', this, oldVnode)
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
  if (isFunction(vnode.component)) {
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
      vnode: child,
      index: i
    }
  })
}

