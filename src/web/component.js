import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import create from '../vdom/create'
import {warn, isString, isArray, extend, each, range, getKeys, isObject} from '../util/index'
import {renderCollection} from './util/index'
import buildInDirectives from './directives'

export class Component {
  constructor (options) {
    if (!options.render && !options.template) {
      throw new Error('Components need to have either a render function or a template to get rendered')
    }
    this.componentOptions = options
    this._options = extend({inputs: {}}, options || {})
    this._renderFn = options.render

    // do not override Component.render function
    delete this._options.render
    extend(this, this._options)

    // Convert inputs to map: ['foo', 'bar']
    this._inputsMap = {}
    if (isArray(this.inputs)) {
      each(this.inputs, inputName => {
        this._inputsMap[inputName] = true
      })
    } else {
      this._inputsMap = this.inputs
    }

    this.refs = {}
  }

  render (context) {
    if (this._options.template) {
      // If the props are specified in the inputs, then allows the template to access the props without using this.props
      each(this.props, (value, key) => {
        if (this._inputsMap[key]) {
          this[key] = value
        }
      })
    }

    if (!this._renderFn) {
      this._renderFn = compile(this._options.template)
      this.componentOptions.render = this._renderFn
    }
    return this._renderFn({
      createElement,
      renderCollection,
      range
    })
  }

  patch (context) {
    context = context || {component: this}
    let oldVnode = this._vnode
    let vnode = this.render(context)
    let domElem = this.elem
    if (!domElem) {
      // First time rendering
      domElem = createDomElement(vnode, context)
    } else {
      // Patch the DOM
      domElem = patchDomElement(domElem, oldVnode, vnode, context)
    }
    this.elem = vnode.elem
    this._vnode = vnode

    return domElem
  }
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
  options.isContainer = isContainer
  options.selector = name
  componentRegistry[name] = options
  return options
}

export function registerContainer (name, options) {
  return registerComponent(name, options, true)
}

export function instantiateComponent (tag) {
  let options
  if (isObject(tag)) {
    options = tag
  } else if (isString(tag) && isRegisteredComponent(tag)) {
    options = componentRegistry[tag]
  }
  if (options) {
    return options.isContainer ? new Container(options) : new Component(options)
  }
  return null
}

export default function createElement (tag, attributes, ...children) {
  let elemTag = instantiateComponent(tag)
  if (elemTag === null) {
    elemTag = tag
  }

  if (attributes) {
    let directives = []
    each(getKeys(attributes), name => {
      const DirConstructor = buildInDirectives[name]
      if (DirConstructor) {
        directives.push(new DirConstructor())
      }
    })

    if (directives.length > 0) {
      attributes.directives = directives
    }
  }

  return create(elemTag, attributes, children)
}
