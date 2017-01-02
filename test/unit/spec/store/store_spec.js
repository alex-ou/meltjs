import Store from 'src/store/index'

describe('store', () => {
  let store
  beforeEach(() => {
    store = new Store(1, (model, msg) => {
      switch (msg) {
        case 'INCREASE': {
          return model + 1
        }
        case 'DECREASE' : {
          return model - 1
        }
      }
    })
  })

  it('stores a model', () => {
    expect(store.getModel()).toBe(1)
  })

  it('should update the model after dispatching the action', () => {
    store.dispatch('INCREASE')
    expect(store.getModel()).toBe(2)
    store.dispatch('INCREASE')
    expect(store.getModel()).toBe(3)

    store.dispatch('DECREASE')
    expect(store.getModel()).toBe(2)
    store.dispatch('DECREASE')
    expect(store.getModel()).toBe(1)
  })

  it('should notify the listeners after the model is updated', () => {
    var listener = jasmine.createSpy()
    let unsubscribe = store.subscribe(listener)
    store.dispatch('INCREASE')
    expect(listener).toHaveBeenCalled()

    unsubscribe(listener)
    store.dispatch('INCREASE')
    expect(listener.calls.count()).toBe(1)
  })

  it('throws exception if listener is not a function', () => {
    expect(() => {
      store.subscribe({})
    }).toThrow()
  })
})
