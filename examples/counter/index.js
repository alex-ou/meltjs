var increase = function (step, model) {
  return model + step
}

var decrease = function (step, model) {
  return model - step
}

Melt.component('counter', {
  template: `<div>
                {count}
                <button on-click="{increase(2)}">+</button>
                <button on-click="{decrease(2)}">-</button>
             </div>`
})

Melt.app({
  el: '#app',
  template: '<counter count="{model}" increase="{actions.increase}" decrease="{actions.decrease}"></counter>',
  model: 0,
  update: {
    increase,
    decrease
  }
})
