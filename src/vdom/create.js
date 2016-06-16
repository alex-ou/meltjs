import {isString, isNumber, isNull, isUndefined} from '../util/index'
import VNode from './vnode'

export default function create (tag, attrs, ...children) {
  children = children.reduce(reduceChildren, [])
  return new VNode(VNode.Element, tag, attrs, children)
}

function reduceChildren (acc, vnode) {
  if (isUndefined(vnode)) {
    throw new Error('vnode cannot be undefined')
  }

  var result = vnode
  if (isString(vnode) || isNumber(vnode)) {
    result = new VNode(VNode.Text, vnode)
  } else if (isNull(vnode)) {
    result = new VNode(VNode.Empty)
  } else if (Array.isArray(vnode)) {
    result = vnode.reduce(reduceChildren, [])
  }
  return acc.concat(result)
}
