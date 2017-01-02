import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import create from '../vdom/create'
import {warn, isString, isArray, extend, each, range} from '../util/index'

export function Component (options) {
  if (!options.render && !options.template) {
    throw new Error('Components need to have either a render function or a template to get rendered')
  }
  this.options = extend({inputs: {}}, options || {})
  this.renderFn = options.render

  // do not override Component.render function
  delete this.options.render
  extend(this, this.options)

  // Convert inputs to map: ['foo', 'bar']
  this.inputsMap = {}
  if (isArray(this.inputs)) {
    each(this.inputs, inputName => {
      this.inputsMap[inputName] = true
    })
  } else {
    this.inputsMap = this.inputs
  }
}

Component.prototype.range = range
Component.prototype.createElement = createElement
Component.prototype._h = createElement
// Render the collection
Component.prototype._c = function renderCollection (items, itemRenderer) {
  let results = []
  each(items, (v, k) => {
    results.push(itemRenderer(v, k))
  })
  return results
}

Component.prototype.render = function () {
  if (this.options.template) {
    // If the props are specified in the inputs, then allows the template to access the props without using this.props
    each(this.props, (value, key) => {
      if (this.inputsMap[key]) {
        this[key] = value
      }
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
  let component = new Component(options)
  componentRegistry[name] = component
  return component
}

export default function createElement (tag, attributes, ...children) {
  let elemTag = tag
  if (isRegisteredComponent(tag)) {
    elemTag = componentRegistry[tag]
  }
  return create(elemTag, attributes, children)
}
