import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import createElement from '../vdom/create'
import {_toString} from './util/index'

export function createComponent (options) {
  if (!options.render && !options.template) {
    throw new Error('Components need to have either a render function or a template to get rendered')
  }

  let vnode, elem, render

  render = options.render
  if (!render) {
    render = compileTemplateToRenderFn(options.template)
  }

  function patch (context) {
    var oldVnode = vnode
    vnode = render.call(context, {
      _h: createElement,
      _s: _toString
    })

    if (!elem) {
      // First time rendering
      elem = createDomElement(vnode)
    } else {
      // Patch the DOM
      elem = patchDomElement(elem, oldVnode, vnode)
    }
    return elem
  }

  return {
    render,
    patch
  }
}

/**
 * Compile the template into a render function
 * @param template
 */
function compileTemplateToRenderFn (template) {
  return compile((template))
}
