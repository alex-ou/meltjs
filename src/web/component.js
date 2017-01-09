import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import create from '../vdom/create'
import {warn, isString, isArray, extend, each, range} from '../util/index'

export class Component {
  constructor (options) {
    if (!options.render && !options.template) {
      throw new Error('Components need to have either a render function or a template to get rendered')
    }
    this.options = extend({inputs: {}}, options || {})
    this.renderFn = options.render

    // do not override Component.render function
    delete this.options.render
    extend(this, this.options)

    // Convert inputs to map: ['foo', 'bar']
    this._inputsMap = {}
    if (isArray(this.inputs)) {
      each(this.inputs, inputName => {
        this._inputsMap[inputName] = true
      })
    } else {
      this._inputsMap = this.inputs
    }
  }

  render (context) {
    if (this.options.template) {
      // If the props are specified in the inputs, then allows the template to access the props without using this.props
      each(this.props, (value, key) => {
        if (this._inputsMap[key]) {
          this[key] = value
        }
      })
    }
    if (!this.renderFn) {
      this.renderFn = compile(this.options.template)
    }
    return this.renderFn()
  }

  patch (context) {
    let oldVnode = this._vnode
    let vnode = this.render(context)
    let elem = this._elem
    if (!elem) {
      // First time rendering
      elem = createDomElement(vnode, context)
    } else {
      // Patch the DOM
      elem = patchDomElement(elem, oldVnode, vnode, context)
    }
    this._elem = elem
    this._vnode = vnode

    return elem
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

export class Container extends Component {
  render (context) {
    // For container, injects the data in context to 'this' to allow the render function to access them
    each(context, (value, key) => {
      this[key] = value
    })
    return super.render(context)
  }
}

// Component Management
var componentRegistry = {}

export function isRegisteredComponent (tag) {
  return isString(tag) && componentRegistry[tag]
}

export function clearComponenetRegistry () {
  componentRegistry = {}
}

export function registerComponent (name, options, isContainer) {
  if (componentRegistry[name]) {
    warn(`Component ${name} is already registered`)
  }
  options.$$isContainer = isContainer

  componentRegistry[name] = options
  return options
}

export function registerContainer (name, options) {
  return registerComponent(name, options, true)
}

export function instantiateComponent (tag) {
  let options
  if (tag && tag.hasOwnProperty('$$isContainer')) {
    options = tag
  } else if (isString(tag) && isRegisteredComponent(tag)) {
    options = componentRegistry[tag]
  }
  if (options) {
    return options.$$isContainer ? new Container(options) : new Component(options)
  }
  return null
}

export default function createElement (tag, attributes, ...children) {
  let elemTag = instantiateComponent(tag)
  if (elemTag === null) {
    elemTag = tag
  }
  return create(elemTag, attributes, children)
}
