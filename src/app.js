import {isFunction, getKeys, each, extend} from './util/index'
import {emptyElement, query, appendChild} from './web/node-op'
import createStore from './store/index'
import {bindActionCreators, createActionCreators} from './store/action'
import {createComponent} from './web/component'

export default function createApp (options) {
  let store, component, actions, rootEl

  const dispatch = action => store.dispatch(action)

  // The root element the the component will be mounted to
  rootEl = options.elem && query(options.elem)
  if (!options.template) {
    options.template = rootEl.innerHTML
  }
  emptyElement(rootEl)

  // the root component which needs to access the model and actions, make it a container
  options.isContainer = true
  component = createComponent(options)

  // Generate the action creators
  actions = {}
  if (!isFunction(options.update)) {
    actions = createActionCreators(getKeys(options.update))
    actions = bindActionCreators(actions, dispatch)
  }

  var update = options.update || {}
  if (!isFunction(update)) {
    update = enhanceHandler(update)
  }
  store = createStore(options.model, update)
  store.subscribe(() => {
    updateView()
  })

  function updateView () {
    let domElem = component.patch(getAppContext())
    appendChild(rootEl, domElem)
  }

  /**
   * Enhances the action handler to allow this.actions to be injected to the handler function as the last argument
   */
  function enhanceHandler (actionHandlerMap) {
    var enhanced = {}
    each(actionHandlerMap, (actionHandler, actionType) => {
      let newHandler = (...params) => {
        // inject 1 more param to the handler, and execute the original handler in the application context
        return actionHandler(getAppContext(), ...params)
      }
      enhanced[actionType] = newHandler
    })
    return enhanced
  }

  function getAppContext () {
    return extend({
      model: store.getModel(),
      dispatch,
      component
    }, actions)
  }

  updateView()

  return extend(
    {
      elem: rootEl,
      component,
      update: updateView,
      getModel: () => store.getModel()
    },
    actions
  )
}
