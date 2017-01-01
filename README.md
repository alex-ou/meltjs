# Opal.js

OpalJS is a very light framework that allows you to create web applications that have predicable behaviors and are easy to test. It has three essential parts: 

* **Model**: the state of the whole application
* **Update**: the only place the model can be mutated
* **Template/Render**: the way to render the model as HTML

## Example
[jsfiddle Demo](https://jsfiddle.net/alex_ou/fomL88qw/)

```javascript
// The pure functons that update the model
// Notice that the model is passed in as the argument
function increase (model) {
  return model + 1
}
function decrease (model) {
  return model - 1
}

Opal.app({
  el: '#app', //the root DOM element
  model: 0,
  update: {
  	increase,
    decrease
  },
  template:
  `<div>{model}
  	<button on-click='{actions.increase()}'>+</button>
    <button on-click='{actions.decrease()}'>-</button>
  </div>`
})

```
## Why another JS framework
Opal was created with the following three purposes:
### Makes component design easier
Opal supports two kinds of components: stateless function components and components with states

### Enforces one way data flow
In Opal, data only flows in one way. In the view, if you want to change the model, actions have to be used to dispatch the data to the application's update method. After the model changes, Opal propagates the changes from the root component to the leaf ones. This is to help maintain a predicable application state and improve the performance

### Provides two-way view rendering - JSX and templates
On one hand, JSX allows you to describe the view using JavaScript, this makes it really flexible as you can utilize all the build-in JS language features, that's why a lot of developers like it. Opal uses virtual DOM to represent the DOM as well, and the `Opal.createElement` function used to create virtual elements is fully compatible with JSX.
On the other hand, writing views using templates with some framework provided directives, e.g. `each`, `if`, `ref` etc, you will end up with very expressive and concise views. Consider the following example, with a glimpse, you can tell that it'll render into a list:

```html
<ul>
  <li each="{item in items}"></li>
</ul>
```
All the templates in Opal will be compiled into virtual DOM so it'll be transparent to developers.
