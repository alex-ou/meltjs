import {has, isNull, isObject, getKeys, each} from '../util/index'

export function bindActionCreator (action, dispatch) {
  return (...args) => dispatch(action(...args))
}

export function bindActionCreators (actions, dispatch) {
  if (!isObject(actions) || isNull(actions)) {
    throw Error('actions must be an object')
  }

  let result = {}
  var keys = getKeys(actions)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    result[key] = bindActionCreator(actions[key], dispatch)
  }
  return result
}

/**
 * Create an action creator given the action type. the returned action creator can take any parameters
 * @param actionType
 * @returns {function()}
 */
export function createActionCreator (actionType) {
  return (...args) => {
    return {
      type: actionType,
      params: args
    }
  }
}
/**
 * Create an object whose keys are actions types and values the action creators. And all the actions creators will be
 * wrapped with the dispatch call, so they can be called directly to dispatch an action
 * @param actionTypes, array of action types
 */
export function createActionCreators (actionTypes) {
  var actionCreators = {}
  each(actionTypes, actionType => {
    if (has(actionCreators, actionType)) {
      throw new Error('Duplicated action type found in' + actionType)
    }
    actionCreators[actionType] = createActionCreator(actionType)
  })
  return actionCreators
}

/**
 * Create an update function which will handle the actions created by calling createActionCreator
 * @param actionHandlerMap, an object which has all the action handlers in format of {actionType: handler}, e.g.
 * {
   *  'Increase': (model) => model + 1,
   *  'Decrease': (model) => model - 1
   *  }
 * @returns {update}, the update function used by the MeltStore
 */
export function createModelUpdater (actionHandlerMap) {
  return function update (model, action) {
    let newModel = model
    // Only update the model if the action type exists
    if (has(actionHandlerMap, action.type)) {
      let handler = actionHandlerMap[action.type]
      newModel = handler(...action.params, model)
    }
    return newModel
  }
}
