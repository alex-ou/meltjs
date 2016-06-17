import patch from './web/patch'
import createElement from './web/create_element'
import createVnode from './vdom/create'
import {emptyElement, query, appendChild} from './web/dom'

class OpalApp {
  constructor (options) {
    this.model = options.model
    this.render = options.render
    this.updateModel = options.update

    this.root = options.el && query(options.el)
    emptyElement(this.root)

    this.renderDom()
  }

  renderDom () {
    var newVnode = this.render(this.model, this.dispatch.bind(this))

    let domElem
    if (!this._elem) {
      domElem = createElement(newVnode)
      appendChild(this.root, domElem)
    } else {
      domElem = patch(this._elem, this._vnode, newVnode)
    }
    this._elem = domElem
    this._vnode = newVnode
  }

  dispatch (action) {
    this.model = this.updateModel(this.model, action)
    this.renderDom()
  }
}

export default function Opal () {}
Opal.h = createVnode

Opal.app = function (options) {
  return new OpalApp(options)
}

