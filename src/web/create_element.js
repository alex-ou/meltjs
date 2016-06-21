import VNode from '../vdom/vnode'
import {isNumber, isString, isNull, isUndefined} from '../util/index'
import * as dom from './dom'
import {setAttribute} from './set_attribute'
import createComponent from './component'

export default function createElement (vnode) {
  var domElem
  switch (vnode.type) {
    case VNode.Element:
      domElem = createHtmlElement(vnode)
      break
    case VNode.Empty:
      domElem = createEmptyNode()
      break
    case VNode.Text:
      domElem = createTextNode(vnode)
      break
    case VNode.Thunk:
      let component = createComponent(vnode)
      domElem = component.createElement()
      break
  }
  vnode.elem = domElem
  return domElem
}

function createHtmlElement (vnode) {
  let {tagName, children, attrs} = vnode

  var elem = dom.createElement(tagName)

  for (let name in attrs) {
    setAttribute(elem, name, attrs[name])
  }

  children.forEach(child => {
    if (isNull(child) || isUndefined(child)) {
      return
    }

    dom.appendChild(elem, createElement(child))
  })
  return elem
}

function createTextNode (vnode) {
  let text = isNumber(vnode.nodeValue) || isString(vnode.nodeValue)
    ? vnode.nodeValue : ''
  return dom.createTextNode(text)
}

function createEmptyNode () {
  return dom.createElement('noscript')
}
