import Opal from './src/index'

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

Opal.component('counter', {
  render (h) {
    return h('div', {}, [
      this.props.count,
      h('button', {'onClick': () => this.props.onIncrease(2)}, '+'),
      h('button', {'onClick': () => this.props.onDecrease(2)}, '-')
    ])
  },
  template: `
    <div>
        {props.count}
        <button on-click="{props.onIncrease(2)}">+</button>
        <button on-click="{props.onDecrease(2)}">-</button>
    </div> `
})

Opal.app({
  el: '#app',
  render: function (h) {
    let {increaseAsync, decrease} = this.actions

    return h('div', {}, [
      this.model,
      h('button', {'onClick': () => increaseAsync(2)}, '+'),
      h('button', {'onClick': () => decrease(2)}, '-')
    ])
  },
  model: 0,
  update: {
    increase,
    increaseAsync,
    decrease
  }
})
