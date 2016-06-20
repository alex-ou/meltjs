import {createActionCreator, createActionCreators, createModelUpdater} from 'src/store/action'

describe('action', () => {
  const INCREASE = 'increase'
  const DECREASE = 'decrease'
  it('creates an action creator which can take any parameters', () => {
    let increase = createActionCreator(INCREASE)
    expect(increase(1)).toEqual({
      type: INCREASE,
      params: [1]
    })

    expect(increase(1, 2, {a: 1})).toEqual({
      type: INCREASE,
      params: [1, 2, {a: 1}]
    })
  })

  it('create actions given an array of action types', () => {
    let actions = createActionCreators([INCREASE, DECREASE])
    expect(Object.keys(actions).length).toBe(2)

    expect(actions[INCREASE](1)).toEqual({
      type: INCREASE,
      params: [1]
    })

    expect(actions[DECREASE](1)).toEqual({
      type: DECREASE,
      params: [1]
    })
  })

  it('throws if duplicated items found in the action types array', () => {
    expect(() => {
      createActionCreators(['a', 'a'])
    }).toThrow()
  })

  it('should trigger the right action', () => {
    let actionHanlder = {}
    actionHanlder[INCREASE] = model => {
      return model + 1
    }
    actionHanlder[DECREASE] = model => model - 1
    let update = createModelUpdater(actionHanlder)

    let increaseAction = createActionCreator(INCREASE)
    let decreaseAction = createActionCreator(DECREASE)
    let model = update(1, increaseAction())
    expect(model).toBe(2)
    model = update(1, decreaseAction())
    expect(model).toBe(0)
  })
})
