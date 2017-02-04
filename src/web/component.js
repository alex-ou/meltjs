import compile from '../compiler/index'
import createDomElement from './create_dom'
import patchDomElement from './patch'
import create from '../vdom/create'
import {isArray, each, range, isObject, noop} from '../util/index'
import {renderCollection} from './util/index'
import {DirectiveHandler} from './directives/index'
import {getComponent} from './component_registry'

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

export default function createElement (tag, attributes, ...children) {
  let options = isObject(tag) ? tag : getComponent(tag)
  let elemTag = options ? createComponent(options) : tag

  const vnode = create(elemTag, attributes, children)
  if (attributes) {
    vnode.addLifecycleEventListener(new DirectiveHandler())
  }
  return vnode
}
