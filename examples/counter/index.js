var increaseAsync = function (step, model, actions) {
  setTimeout(() => {
    actions.increase(step)
  }, 2000)
  return model
}

var increase = function (step, model) {
  return model + step
}

var decrease = function (step, model) {
  return model - step
}

Opal.app({
  el: '#app',
  render: function () {
    let h = this.createElement
    let {increaseAsync, decrease, increase} = this.actions

    return h('div', {}, [
      this.model,
      h('button', {'onClick': () => increase(2)}, '+'),
      h('button', {'onClick': () => decrease(2)}, '-'),
      h('button', {'onClick': () => increaseAsync(2)}, 'Increase Async')
    ])
  },
  // template: '<div>test</div>',
  model: 0,
  update: {
    increase,
    increaseAsync,
    decrease
  }
})
