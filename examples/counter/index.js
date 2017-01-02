var increaseAsync = function (step, model, actions) {
  setTimeout(() => {
    actions.increase(step)
  }, 2000)
  return model
}

var increase = function (step, model) {
  model.count += step
  return model
}

var decrease = function (step, model) {
  model.count -= step
  return model
}

Melt.component('counter', {
  template: `<div class="{alertClass()}">
                {count}
                <button on-click="{increase(2)}">+</button>
                <button on-click="{decrease(2)}">-</button>
                <div if="{count > 4}">too big</div>
                <div>
                  <span each="n in range(count)">{n + ','}</span>
                </div>
             </div>`,
  alertClass: function () {
    return this.count > 2 ? 'red' : ''
  }
})

Melt.app({
  el: '#app',
  template: '<counter count="{model.count}" increase="{actions.increase}" decrease="{actions.decrease}"></counter>',
  model: {
    count: 0
  },
  update: {
    increase,
    increaseAsync,
    decrease
  }
})
