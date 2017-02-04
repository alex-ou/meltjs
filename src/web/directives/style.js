import {each} from '../../util/index'

export default class StyleDirective {
  updateStyle (binding, domElem) {
    if (binding.args.length === 0) {
      throw new Error('Invalid style binding')
    }

    this.clearStyle(domElem)

    let style = {}
    if (binding.args[0] === '*') {
      style = binding.value
    } else {
      const styleKey = binding.args[0]
      style[styleKey] = binding.value
    }
    each(style, (value, key) => {
      domElem.style[key] = value
    })

    this.style = style
  }

  clearStyle (domElem) {
    if (!this.style) {
      return
    }
    each(this.style, (value, key) => {
      domElem.style.setProperty(key, '')
    })
  }

  attached (binding, vnode) {
    this.updateStyle(binding, vnode.elem)
  }

  updated (binding, newVnode) {
    this.updateStyle(binding, newVnode.elem, this.style)
  }

  detached (vnode) {
    this.clearStyle(vnode.elem)
  }
}
