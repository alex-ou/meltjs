import Opal from './src/index'

var h = Opal.h

Opal.app({
  el: '#app',
  render: function (model, dispatch) {
    return h('div', {}, [
      model,
      h('button', {'onClick': () => dispatch({'type': 'INCREMENT'})}, 'Increase'),
      h('button', {'onClick': () => dispatch({'type': 'DECREMENT'})}, 'Decrease')
    ])
  },
  model: 0,
  update: function (model, action) {
    switch (action.type) {
      case 'INCREMENT':
        return model + 1
      case 'DECREMENT':
        return model - 1
      default:
        return model
    }
  }
})
