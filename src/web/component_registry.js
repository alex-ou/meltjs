import {warn, isString, each} from '../util/index'

// Component Management
let componentRegistry = {}

export function clearRegistry () {
  each(componentRegistry, (componentOptions, name) => {
    if (!componentOptions.isBuildIn) {
      delete componentRegistry[name] // only remove the non-build-in components
    }
  })
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

export function registerDirective (name, options) {
  const compOptions = registerComponent(name, options)
  compOptions.isDirective = true
  return compOptions
}

export function getComponent (tag) {
  return isString(tag) && componentRegistry[tag]
}

export function isRegistered (name) {
  return !!getComponent(name)
}
