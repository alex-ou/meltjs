import {setAttribute, removeAttribute} from './set_attribute'
import createDomElement from './create_dom'
import {groupByKey, renderThunk} from '../vdom/vnode'
import diff, * as diffActions from '../vdom/diff'
import {has, isUndefined, isNull, each} from '../util/index'
import * as nodeOp from './node-op'

/**
 * Compare two virtual nodes and update the dom element
 */

export default function patchNode (domElem, oldVnode, newVnode, context) {
  context = context || {}
  newVnode.parentComponent = context.component
  // Skip updating this whole sub-tree
  if (oldVnode === newVnode) {
    return domElem
  }

  // Remove the DOM
  if (!isUndefined(oldVnode) && isUndefined(newVnode)) {
    // Unmount the components
    unmountThunk(oldVnode)
    nodeOp.removeChild(domElem.parentNode, domElem)
    return domElem
  }

  // Replace the DOM
  if (!isNull(oldVnode) && isNull(newVnode) || isNull(oldVnode) && !isNull(newVnode) || !oldVnode.isSameType(newVnode)) {
    return replaceNode(domElem, oldVnode, newVnode, context)
  }

  // Two nodes with the same type reaching this point

  // Element
  let newDomElem = domElem
  if (newVnode.isElement()) {
    if (oldVnode.tagName !== newVnode.tagName) {
      // Replace the whole DOM element
      newDomElem = replaceNode(domElem, oldVnode, newVnode, context)
    } else {
      // Same tagName, update the attributes
      updateAttributes(domElem, oldVnode, newVnode)
      newVnode.updated(domElem, oldVnode)
      patchChildren(domElem, oldVnode, newVnode, context)
    }
  } else if (newVnode.isText()) {
    // Text
    if (oldVnode.nodeValue !== newVnode.nodeValue) {
      setAttribute(domElem, 'nodeValue', newVnode.nodeValue, oldVnode.nodeValue)
    }
  } else if (newVnode.isThunk()) {
    newDomElem = updateThunk(domElem, oldVnode, newVnode, context)
  }
  return newDomElem
}

export function patchChildren (parentElem, oldNode, newNode, context) {
  let { CREATE, UPDATE, MOVE, REMOVE } = diffActions
  let oldChildren = groupByKey(oldNode.children)
  let newChildren = groupByKey(newNode.children)
  let key = a => a.key

  // Make a copy of the references to children to be deleted
  let domChildNodes = Array.prototype.slice.call(nodeOp.childNodes(parentElem))

  function effect (type, prev, next, pos) {
    switch (type) {
      case CREATE: {
        let newDomElem = createDomElement(next.vnode, context)
        nodeOp.insertBefore(parentElem, newDomElem, nodeOp.childNode(parentElem, pos))
        break
      }
      case UPDATE: {
        let domElem = nodeOp.childNode(parentElem, prev.index)
        patchNode(domElem, prev.vnode, next.vnode, context)
        break
      }
      case MOVE: {
        let childDomElem = nodeOp.childNode(parentElem, prev.index)
        patchNode(childDomElem, prev.vnode, next.vnode, context)
        nodeOp.insertBefore(parentElem, childDomElem, nodeOp.childNode(parentElem, pos))
        break
      }
      case REMOVE: {
        unmountThunk(prev.vnode)
        nodeOp.removeChild(parentElem, domChildNodes[prev.index])
        break
      }
    }
  }

  diff(oldChildren, newChildren, effect, key)
}

function updateThunk (domElem, oldNode, newNode, context) {
  let oldThunkVnode = oldNode.thunkVnode
  let newThunkVnode = renderThunk(newNode, context)
  newNode.thunkVnode = newThunkVnode

  const currentComponent = context.component
  context.component = newNode.component
  const newDomElem = patchNode(domElem, oldThunkVnode, newThunkVnode, context)
  context.component = currentComponent

  newNode.updated(newDomElem, oldNode)

  return newDomElem
}

function unmountThunk (vnode) {
  // Call the lifecycle hook
  vnode.unmounted()

  if (vnode.isThunk()) {
    unmountThunk(vnode.thunkVnode)
  } else if (vnode.children) {
    each(vnode.children, child => unmountThunk(child))
  }
}
/**
 * compare the attributes of the two virtual nodes and update the dom attributes and event handlers
 * @param domElem
 * @param oldNode
 * @param newNode
 */
function updateAttributes (domElem, oldNode, newNode) {
  let oldAttributes = oldNode.attributes
  let newAttributes = newNode.attributes

  for (let name in newAttributes) {
    if (newAttributes[name] !== oldAttributes[name]) {
      setAttribute(domElem, name, newAttributes[name], oldAttributes[name])
    }
  }

  for (let name in oldAttributes) {
    if (!has(newAttributes, name)) {
      removeAttribute(domElem, name, oldAttributes[name])
    }
  }
}

function replaceNode (domElem, oldNode, newNode, context) {
  unmountThunk(oldNode)
  let newDomElem = createDomElement(newNode, context)
  nodeOp.replaceNode(newDomElem, domElem)
  return newDomElem
}

