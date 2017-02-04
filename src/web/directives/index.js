import ref from './ref'
import style from './style'
import {isArray, isFunction, each, noop} from '../../util/index'
import {registerDirective, isRegistered, getComponent} from '../component_registry'

each({ref, style}, (dirClass, dirName) => registerDirective(dirName, {
  class: dirClass,
  isBuildIn: true
}))

export function createDirective (options, binding) {
  let DirectiveClass
  if (isFunction(options)) {
    DirectiveClass = options
  } else {
    DirectiveClass = options.class || noop
  }

  function Directive (options) {
    this._options = options

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

    DirectiveClass.call(this, binding)
  }

  Directive.prototype = Object.create(DirectiveClass.prototype, {
    constructor: Directive
  })

  return new Directive(options, binding)
}

const LifecycleEvent = {
  ATTACHED: 'attached',
  UPDATED: 'updated',
  DETACHED: 'detached'
}

export class DirectiveHandler {
  _parseDirectives (attrs) {
    const directives = {}
    each(attrs || [], (attrValue, attrName) => {
      const parts = attrName.split('.')
      const dirName = parts[0]
      parts.shift()
      if (isRegistered(dirName)) {
        directives[attrName] = ({
          name: dirName,
          value: attrValue,
          args: parts
        })
      }
    })
    return directives
  }

  _createDirective (binding) {
    const dirOption = getComponent(binding.name)
    return createDirective(dirOption, binding)
  }

  _callback (dir, name, ...args) {
    const callback = dir[name]
    if (callback) {
      callback.apply(dir, args)
    }
  }

  mounted (vnode) {
    vnode.directives = {}
    each(this._parseDirectives(vnode.attributes), (dirBinding, attrName) => {
      const dir = this._createDirective(dirBinding)
      vnode.directives[attrName] = dir
      this._callback(dir, LifecycleEvent.ATTACHED, dirBinding, vnode)
    })
  }

  updated (newVnode, oldVnode) {
    const newDirBindings = this._parseDirectives(newVnode.attributes)
    const oldDirs = oldVnode.directives
    const newDirs = []
    each(newDirBindings, (dirBinding, attrName) => {
      const dir = oldDirs[attrName]
      if (dir) {
        // existing directives, copy them over and call updated lifecycle hook
        newDirs[attrName] = dir
        this._callback(dir, LifecycleEvent.UPDATED, dirBinding, newVnode, oldVnode)
      } else {
        newDirs[attrName] = this._createDirective(dirBinding)
        this._callback(dir, LifecycleEvent.ATTACHED, dirBinding, newVnode)
      }
    })
    each(oldDirs, (dir, attrName) => {
      if (!newDirs[attrName]) {
        // call detached
        this._callback(dir, LifecycleEvent.DETACHED, oldVnode)
      }
    })
    newVnode.directives = newDirs
  }

  unmounted (vnode) {
    each(vnode.directives, dir => {
      this._callback(dir, LifecycleEvent.DETACHED, vnode)
    })
  }
}
