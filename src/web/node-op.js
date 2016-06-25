import {isUndefined, isString} from '../util/index'
import {getSvgAttributeNamespace, namespaceMap, isSvgElement} from './util/elements'

export function setAttribute (node, key, val) {
  var ns = getSvgAttributeNamespace(key)
  return ns
    ? node.setAttributeNS(ns, key, val)
    : node.setAttribute(key, val)
}

export function createElement (tagName) {
  if (isSvgElement(tagName)) {
    return document.createElementNS(namespaceMap.svg, tagName)
  }

  return document.createElement(tagName)
}

export function createTextNode (str) {
  return document.createTextNode(str)
}

export function insertBefore (parentNode, newNode, referenceNode) {
  let refNode = referenceNode
  if (isUndefined(refNode)) {
    refNode = null
  }
  // If referenceNode is null, the newNode is inserted at the end of the list of child nodes.
  parentNode.insertBefore(newNode, refNode)
}

export function removeChild (node, child) {
  node.removeChild(child)
}

export function appendChild (node, child) {
  node.appendChild(child)
}

export function replaceNode (newNode, node) {
  if (node.parentNode) {
    node.parentNode.replaceChild(newNode, node)
  }
}

export function emptyElement (el) {
  let node
  while ((node = el.firstChild)) {
    el.removeChild(node)
  }
  return el
}

export function query (el) {
  if (isString((el))) {
    return document.querySelector(el)
  }

  return el
}

export function tagName (node) {
  return node.tagName
}

export function childNode (node, i) {
  return node.childNodes[i]
}

export function childNodes (node) {
  return node.childNodes
}

export function removeEventListener (node, eventType, handler) {
  node.removeEventListener(eventType, handler)
}

export function addEventListener (node, eventType, handler) {
  node.addEventListener(eventType, handler)
}

