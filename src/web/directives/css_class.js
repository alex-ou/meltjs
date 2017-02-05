import {each, isObject, isNumber, isString, isArray} from '../../util/index'

// takes any number of arguments (string/number or object) and add them into the the array according to the following rules:
// Object: keys will be added to the array if their value evaluates to a truthy value
// strings are shorthand for {str: true}, thus will be added
function classNames (...args) {
  const classes = []
  each(args, value => {
    if (isString(value) || isNumber(value)) {
      classes.push(value)
    } else if (isArray(value)) {
      Array.prototype.push.apply(classes, classNames.apply(null, value))
    } else if (isObject(value)) {
      each(value, (v, k) => {
        if (v) {
          classes.push(k)
        }
      })
    }
  })
  return classes
}

function addClass (domElem, ...classesToAdd) {
  if (classesToAdd.length === 0) {
    return
  }

  if (domElem.classList) {
    each(classesToAdd, cls => domElem.classList.add(cls))
  } else {
    const currentClasses = domElem.className.split(/\s+/)
    each(classesToAdd, cls => {
      cls = cls.trim()
      if (currentClasses.indexOf(cls) === -1) {
        currentClasses.push(cls)
      }
    })
    domElem.className = currentClasses.join(' ')
  }
}

function removeClass (domElem, ...classesToRemove) {
  if (!classesToRemove) {
    return
  }
  if (domElem.classList) {
    each(classesToRemove, cls => domElem.classList.remove(cls))
  } else {
    const currentClasses = domElem.className.split(/\s+/)
    domElem.className = currentClasses.filter(cls => classesToRemove.indexOf(cls.trim()) === -1).join(' ')
  }
}

export default class ClassDirective {
  updateClasses (binding, domElem) {
    if (binding.args.length === 0) {
      // normal class attribute, don't apply the binding
      return
    }
    let value = {}
    if (binding.args[0] === '*') {
      value = binding.value
      if (isString(value)) {
        value = value.split(/\s+/)
      }
    } else {
      value[binding.args[0]] = binding.value
    }
    removeClass(domElem, ...(this._oldClasses || []))
    const classes = classNames(value)
    addClass(domElem, ...classes)

    this._oldClasses = classes
  }

  attached (binding, vnode) {
    this.updateClasses(binding, vnode.elem)
  }

  updated (binding, newVnode) {
    this.updateClasses(binding, newVnode.elem)
  }

  detached (vnode) {
    removeClass(vnode.elem, ...(this._oldClasses || []))
  }
}
