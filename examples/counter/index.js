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
  template: `<div class="{alertClass()}">
                {count}
                <button on-click="{increase(2)}">+</button>
                <button on-click="{decrease(2)}">-</button>
                <div if="{count > 4}">too big</div>
                <div each="{(v, k) in count}">{a}</div>
             </div>`,
  alertClass: function () {
    return this.count > 2 ? 'red' : ''
  }
})

Opal.app({
  el: '#app',
  template: '<counter count="{model}" increase="{actions.increase}" decrease="{actions.decrease}"></counter>',
  model: 0,
  update: {
    increase,
    increaseAsync,
    decrease
  }
})
