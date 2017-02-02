import ref from './ref'
import style from './style'
import {isArray, isFunction, each, noop} from '../../util/index'
import {registerDirective} from '../component_registry'

each({ref, style}, (dirClass, dirName) => registerDirective(dirName, {
  class: dirClass,
  isBuildIn: true,
  isDirective: true
}))

export function createDirective (options) {
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

    DirectiveClass.call(this)
  }

  Directive.prototype = Object.create(DirectiveClass.prototype, {
    constructor: Directive
  })

  return new Directive(options)
}
