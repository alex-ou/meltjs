# opal.js

## Examples

```javascript
import Opal from './src/index'

//model is always passed in as the last argument
var increase = function (model) {
  return model + 1
}

var decrease = function (model) {
  return model - 1
}

Opal.app({
  el: '#app',
  render: function (h) {
    // OpalJS will automatially generate the actions based on the keys 
    // passed into the update function
    let {increase, decrease} = this.actions
    let count = this.model

    return h('div', {}, [
      count,
      h('button', {'onClick': () => increase()}, '+'),
      h('button', {'onClick': () => decrease()}, '-')
    ])
  },
  model: 0,
  update: {
    increase,
    decrease
  }
})

```