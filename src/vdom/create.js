import {isString, isNumber, isNull, isUndefined, isFunction, isObject, warn} from '../util/index'
import VNode from './vnode'

export default function create (tag, attributes, ...children) {
  children = children.reduce(reduceChildren, [])
  // Stateless function component
  if (isFunction(tag)) {
    return new VNode({
      type: VNode.Thunk,
      renderFn: tag,
      attributes,
      children,
      options: tag
    })
  }
  // Object style component
  if (isObject(tag)) {
    return new VNode({
      type: VNode.Thunk,
      renderFn: tag.render,
      attributes,
      children,
      options: tag
    })
  }
  return new VNode({
    type: VNode.Element,
    tagName: tag,
    attributes,
    children
  })
}

function reduceChildren (acc, vnode) {
  if (isUndefined(vnode)) {
    vnode = 'undefined'
    warn('Node value is undefined')
  }

  var result
  if (isString(vnode) || isNumber(vnode)) {
    result = new VNode({
      type: VNode.Text,
      nodeValue: vnode
    })
  } else if (isNull(vnode)) {
    result = new VNode({
      type: VNode.Empty
    })
  } else if (Array.isArray(vnode)) {
    result = vnode.reduce(reduceChildren, [])
  } else {
    // Thunk element or element
    result = vnode
  }
  return acc.concat(result)
}
