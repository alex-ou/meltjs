import {isString, isNumber, isNull, isUndefined, isFunction, isObject} from '../util/index'
import VNode from './vnode'

export default function create (tag, attrs, ...children) {
  children = children.reduce(reduceChildren, [])
  // Stateless function component
  if (isFunction(tag)) {
    return new VNode(VNode.Thunk, tag, attrs, children, tag)
  }
  // Object style component
  if (isObject(tag)) {
    return new VNode(VNode.Thunk, tag.render, attrs, children, tag)
  }
  return new VNode(VNode.Element, tag, attrs, children)
}

function reduceChildren (acc, vnode) {
  if (isUndefined(vnode)) {
    throw new Error('vnode cannot be undefined')
  }

  var result
  if (isString(vnode) || isNumber(vnode)) {
    result = new VNode(VNode.Text, vnode)
  } else if (isNull(vnode)) {
    result = new VNode(VNode.Empty)
  } else if (Array.isArray(vnode)) {
    result = vnode.reduce(reduceChildren, [])
  } else {
    // Thunk element or element
    result = vnode
  }
  return acc.concat(result)
}
