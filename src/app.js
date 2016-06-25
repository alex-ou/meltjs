import {isFunction, getKeys, each} from './util/index'
import patch from './web/patch'
import createDomElement from './web/create_element'
import {emptyElement, query, appendChild} from './web/node-op'
import OpalStore from './store/index'
import {bindActionCreators, createActionCreators, createModelUpdater} from './store/action'
import createElement from './vdom/create'

export default class OpalApp {
  constructor (options) {
    this.model = options.model
    this.render = options.render

    this.createStore(options)

    this.root = options.el && query(options.el)
    emptyElement(this.root)
    this.updateView()
  }

  createStore (options) {
    var modelUpdator = options.update || {}
    if (!isFunction(modelUpdator)) {
      modelUpdator = createModelUpdater(this.enhanceHandler(options.update))
      let actions = createActionCreators(getKeys(options.update))
      this.actions = bindActionCreators(actions, this.dispatch.bind(this))
    }

    this.store = new OpalStore(options.model, modelUpdator)
    this.store.subscribe(() => {
      this.model = this.store.getModel()
      this.updateView()
    })
  }

  // Enhances the action handler to allow this.actions to be injected to the handler function as the last argument
  enhanceHandler (actionHandlerMap) {
    var enhanced = {}
    each(actionHandlerMap, (actionHandler, actionType) => {
      let newHandler = (...params) => {
        // inject 1 more param to the handler, and execute the original handler in the application context
        return actionHandler.apply(this, [...params, this.actions])
      }
      enhanced[actionType] = newHandler
    })
    return enhanced
  }

  updateView () {
    var oldVnode = this._vnode
    // Inject the createElement function to the render function
    var newVnode = this.render(createElement)

    let domElem = this._elem
    if (!domElem) {
      // First time rendering
      domElem = createDomElement(newVnode)
      appendChild(this.root, domElem)
    } else {
      // Patch the DOM
      domElem = patch(this._elem, oldVnode, newVnode)
    }

    this._elem = domElem
    this._vnode = newVnode
  }

  dispatch (action) {
    this.store.dispatch(action)
  }
}

