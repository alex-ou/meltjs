# MeltJS
A minimalistic yet powerful Javascript library for building web user interfaces. MeltJS has three essential parts:
* **Model**: the state of the whole application
* **Update**: the only place the model can be mutated
* **Template**: the way to render the model as HTML
## Features
### Template-based
Write expressive and concise views in pure HTML with react-like binding syntax and built-in directives e.g. `each`, `if`, `ref` etc.
```html
<ul>
  <li each="item in items" if='item > 0' class.completed="{isCompleted}"></li>
</ul>
```
### Component/Container support
Better separation of concerns and code reusability with presentational components and container components. Connect views to the model easily via containers to get a clean component structure.
### One-way data flow
Predicable application state with a single model and one-way root-to-leaf data flow. Hassle-free way to dispatch the action and data to the model update functions.
### Custom directives
Wrap DOM interactions inside custom directives to create more expressive views and achieve more code reusability 

## Example
[jsfiddle Demo](https://jsfiddle.net/alex_ou/fomL88qw/)

```javascript
// The pure functons that take the model as the argument, and return a new model
function increase ({model}) {
  return model + 1
}
function decrease ({model}) {
  return model - 1
}

Melt.app({
  el: '#app', //the root DOM element
  model: 0,
  update: {
  	increase,
    decrease
  },
  template: 
  `<div>{model}
  	<button on-click='{increase()}'>+</button>
    <button on-click='{decrease()}'>-</button>
  </div>`
})
```
