import {isFunction} from '../util/index'

export default class Store {
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

