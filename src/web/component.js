import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import create from '../vdom/create'
import {warn, isString, isArray, extend, each, range, getKeys, isObject, noop} from '../util/index'
import {renderCollection} from './util/index'
import buildInDirectives from './directives'

export function createComponent (options) {
  if (!options.render && !options.template) {
    throw new Error('Components need to have either a render function or a template to get rendered')
  }

  const ComponentClass = options.class || noop

  function Component (options) {
    this._options = options
    this._renderFn = options.render

    const propsSpec = options.props || {}
    // Convert props spec to map if is array: ['foo', 'bar']
    this._propsSpec = {}
    if (isArray(propsSpec)) {
      each(propsSpec, name => {
        this._propsSpec[name] = true
      })
    } else {
      this._propsSpec = propsSpec
    }

    ComponentClass.call(this)
  }

  Component.prototype = Object.create(ComponentClass.prototype, {
    constructor: Component
  })

  Component.prototype.render = function render (context) {
    // For container, injects the data in context to 'this' to allow the render function to access them
    if (this._options.isContainer) {
      each(context, (value, key) => {
        this[key] = value
      })
    }

    if (this._options.template) {
      // If the props are specified, then allows the template to access the props without using this.props
      each(this.props, (value, key) => {
        if (this._propsSpec[key]) {
          this[key] = value
        }
      })
    }

    if (!this._renderFn) {
      this._renderFn = compile(this._options.template)
      options.render = this._renderFn
    }
    return this._renderFn({
      createElement,
      renderCollection,
      range,
      component: this
    })
  }

  Component.prototype.patch = function patch (context) {
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

  return new Component(options)
}

// Component Management
var componentRegistry = {}

export function isRegisteredComponent (tag) {
  return isString(tag) && componentRegistry[tag]
}

export function clearRegistry () {
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

export default function createElement (tag, attributes, ...children) {
  let elemTag = instantiateComponent(tag)
  if (elemTag === null) {
    elemTag = tag
  }

  // process the attribute directives
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

function instantiateComponent (tag) {
  let options
  if (isObject(tag)) {
    options = tag
  } else if (isString(tag) && isRegisteredComponent(tag)) {
    options = componentRegistry[tag]
  }
  return options ? createComponent(options) : null
}
