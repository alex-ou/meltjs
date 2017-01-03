var increase = function (context, step) {
  return context.model + step
}

var decrease = function ({model}, step) {
  return model - step
}

Melt.component('counter', {
  inputs: ['count', 'increase', 'decrease'],
  template: `<div>
                {count}
                <button on-click="{increase(2)}">+</button>
                <button on-click="{decrease(2)}">-</button>
             </div>`
})

Melt.app({
  el: '#app',
  template: '<counter count="{model}" increase="{increase}" decrease="{decrease}"></counter>',
  model: 0,
  update: {
    increase,
    decrease
  }
})
