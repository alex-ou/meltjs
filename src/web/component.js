import compile from '../compiler/index'
import createDomElement from './create_element'
import patchDomElement from './patch'
import createElement from '../vdom/create'

export function createComponent (options) {
  if (!options.render && !options.template) {
    throw new Error('Components need to have either a render function or a template to get rendered')
  }

  let vnode, elem, render

  render = options.render
  if (!render) {
    let renderFn = compileTemplateToRenderFn(options.template)
    render = () => renderFn(createElement)
  }

  function patch (context) {
    var oldVnode = vnode
    vnode = render.apply(context)

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
