import {has, isUndefined, isString} from '../util/index'

export const namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
}

var svgElements = 'animate,circle,defs,ellipse,g,line,linearGradient,mask,path,pattern,polygon,polyline,radialGradient,rect,stop,svg,text,tspan'.split(',')
var svgMap = svgElements
  .reduce(function (acc, name) {
    acc[name] = true
    return acc
  }, {})

const svgAttributeNamespaces = {
  ev: 'http://www.w3.org/2001/xml-events',
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xmlns: 'http://www.w3.org/2000/xmlns/'
}

/**
 * Get namespace of svg attribute
 *
 * @param {String} attributeName
 * @return {String} namespace
 */

function getSvgAttributeNamespace (attributeName) {
  // if no prefix separator in attributeName, then no namespace
  if (attributeName.indexOf(':') === -1) return null

  // get prefix from attributeName
  var prefix = attributeName.split(':', 1)[0]

  // if prefix in supported prefixes
  if (has(svgAttributeNamespaces, prefix)) {
    // then namespace of prefix
    return svgAttributeNamespaces[prefix]
  } else {
    // else unsupported prefix
    throw new Error('svg-attribute-namespace: prefix "' + prefix + '" is not supported by SVG.')
  }
}

export function setAttribute (node, key, val) {
  var ns = getSvgAttributeNamespace(key)
  return ns
    ? node.setAttributeNS(ns, key, val)
    : node.setAttribute(key, val)
}

export function isSvgElement (name) {
  return has(svgMap, name)
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
  let refNode = referenceNode;
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

