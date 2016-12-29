import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import create from '../vdom/create'
import {_toString} from './util/index'
import {warn, isString, extend, each} from '../util/index'

export function Component (options) {
  if (!options.render && !options.template) {
    throw new Error('Components need to have either a render function or a template to get rendered')
  }
  this.options = extend({}, options || {})
  this.renderFn = options.render

  // do not override Component.render function
  delete this.options.render
  extend(this, this.options)
}

Component.prototype.createElement = createElement
Component.prototype._h = createElement
Component.prototype._s = _toString

Component.prototype.render = function () {
  if (this.options.template) {
    // Allows the template to access the props without using this.props
    each(this.props, (value, key) => {
      this[key] = value
    })
  }
  if (!this.renderFn) {
    this.renderFn = compile(this.options.template)
  }
  return this.renderFn()
}

Component.prototype.patch = function (context) {
  each(context, (value, key) => {
    this[key] = value
  })

  let oldVnode = this._vnode
  let vnode = this.render()
  let elem = this._elem
  if (!elem) {
    // First time rendering
    elem = createDomElement(vnode)
  } else {
    // Patch the DOM
    elem = patchDomElement(elem, oldVnode, vnode)
  }
  this._elem = elem
  this._vnode = vnode

  return elem
}

// Component Management
var componentRegistry = {}

export function isRegisteredComponent (tag) {
  return isString(tag) && componentRegistry[tag]
}

export function clearComponenetRegistry () {
  componentRegistry = {}
}

export function registerComponent (name, options) {
  if (componentRegistry[name]) {
    warn(`Component ${name} is already registered`)
  }
  componentRegistry[name] = new Component(options)
}

export default function createElement (tag, attributes, ...children) {
  let elemTag = tag
  if (isRegisteredComponent(tag)) {
    elemTag = componentRegistry[tag]
  }
  return create(elemTag, attributes, children)
}
