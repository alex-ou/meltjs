import {each} from '../../util/index'

function updateStyle (vnode) {
  const domElem = vnode.elem
  const style = vnode.props.style
  if (!style) {
    return
  }
  each(style, (value, key) => {
    domElem.style[key] = value
  })
}

export default class StyleDirective {
  mounted (vnode) {
    updateStyle(vnode)
  }

  updated (newVnode) {
    updateStyle(newVnode)
  }
}
