import Melt from 'src/index'

describe('Melt app', () => {
  it('should pass the context to the update function', () => {
    const initialModel = {foo: 'foo'}
    var testFunc = function (context, payload) {
      expect(context).toBeDefined()
      expect(context.model).toEqual(initialModel)
      expect(context.testFunc).toBeDefined()
      expect(payload).toBe(1)
    }

    const app = Melt({
      elem: document.body,
      template: '<div></div>',
      model: initialModel,
      update: {
        testFunc
      }
    })

    expect(app.testFunc).toBeDefined()
    app.testFunc(1)
  })

  it('should correctly update the model', () => {
    function increase ({model}, payload) {
      return {
        count: model.count + payload
      }
    }
    function decrease ({model}, payload) {
      return {
        count: model.count - payload
      }
    }

    const app = Melt({
      elem: document.body,
      template: '<div></div>',
      model: {count: 0},
      update: {
        increase,
        decrease
      }
    })

    app.increase(2)
    expect(app.getModel()).toEqual({count: 2})
    app.increase(2)
    expect(app.getModel()).toEqual({count: 4})
    app.decrease(4)
    expect(app.getModel()).toEqual({count: 0})
  })
})
