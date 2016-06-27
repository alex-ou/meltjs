import {isFunction, noop} from '../util/index'
import {createModelUpdater} from './action'

export class Store {
  constructor (initialModel, updater) {
    this.model = initialModel
    this.modelUpdater = updater

    this.listeners = []
  }

  getModel () {
    return this.model
  }

  dispatch (action) {
    let update = this.modelUpdater
    let oldModel = this.model

    this.model = update(oldModel, action)

    this.listeners.forEach(listener => {
      listener()
    })
  }

  subscribe (listener) {
    if (!isFunction(listener)) {
      throw new Error('Invalid argument: listener needs to be a function')
    }

    var allListeners = this.listeners
    allListeners.push(listener)

    return function unsubscribe () {
      const index = allListeners.indexOf(listener)

      if (index >= 0) {
        allListeners.splice(index, 1)
      }
    }
  }
}

export default function createStore (model, update) {
  var modelUpdater = update || noop
  if (!isFunction(modelUpdater)) {
    modelUpdater = createModelUpdater(update)
  }
  return new Store(model, modelUpdater)
}

