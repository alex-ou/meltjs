var increase = function (context, step) {
  return context.model + step
}

var decrease = function ({model}, step) {
  return model - step
}

Melt.component('counter', {
  props: ['count', 'onIncrease', 'onDecrease'],
  template: `<div>
                {count}
                <button on-click="{onIncrease(2)}">+</button>
                <button on-click="{onDecrease(2)}">-</button>
             </div>`
})

Melt.container('app', {
  template: '<counter count="{model}" on-increase="{increase}" on-decrease="{decrease}"></counter>'
})

Melt.app({
  elem: '#app',
  template: '<app></app>',
  model: 0,
  update: {
    increase,
    decrease
  }
})
