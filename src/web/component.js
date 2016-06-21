import createDomElement from './create_element'
import {isFunction} from '../util/index'

class InternalComponnet {
  constructor (refNode) {
    this.refNode = refNode
    this.props = refNode.attrs
    this.children = refNode.children

    this.isStateless = isFunction(refNode.options)

    // Save the component to the refNode for patch operation
    refNode.component = this
  }

  render () {
    const renderFn = this.refNode.renderFn
    if (this.isStateless) {
      // the stateless function will get props through function params
      return renderFn(this)
    }
    // the component will get props through this.props
    return renderFn.call(this)
  }

  createElement () {
    let vnode = this.render()
    this.vnode = vnode
    this.elm = createDomElement(vnode)
    return this.elm
  }
}

export default function createComponent (vnode) {
  return new InternalComponnet(vnode)
}
