import VNode, {renderThunk} from '../vdom/vnode'
import {isNumber, isString, isNull, isUndefined} from '../util/index'
import * as nodeOp from './node-op'
import {setAttribute} from './set_attribute'

export default function createElement (vnode, context) {
  context = context || {}
  var domElem
  vnode.parentComponent = context.component
  vnode.beforeMount()
  switch (vnode.type) {
    case VNode.Element:
      domElem = createHtmlElement(vnode, context)
      break
    case VNode.Empty:
      domElem = createEmptyNode()
      break
    case VNode.Text:
      domElem = createTextNode(vnode)
      break
    case VNode.Thunk:
      domElem = createThunk(vnode, context)
      break
  }
  vnode.mounted(domElem)
  return domElem
}

function createThunk (vnode, context) {
  vnode.thunkVnode = renderThunk(vnode, context)
  const currentComponent = context.component

  context.component = vnode.component
  const domElem = createElement(vnode.thunkVnode, context)

  // recover the component context
  context.component = currentComponent
  return domElem
}

function createHtmlElement (vnode, context) {
  let {tagName, children, attributes} = vnode

  var elem = nodeOp.createElement(tagName)

  for (let name in attributes) {
    setAttribute(elem, name, attributes[name])
  }

  children.forEach(child => {
    if (isNull(child) || isUndefined(child)) {
      return
    }

    nodeOp.appendChild(elem, createElement(child, context))
  })
  return elem
}

function createTextNode (vnode) {
  let text = isNumber(vnode.nodeValue) || isString(vnode.nodeValue)
    ? vnode.nodeValue : ''
  return nodeOp.createTextNode(text)
}

function createEmptyNode () {
  return nodeOp.createElement('noscript')
}
