# Opal.js

OpalJS is a very light framework that allows you to create web applications that have predicable behaviors and are easy to test. It has three essential parts: 

* **Model**: the state of the whole application
* **Update**: the only place the model can be mutated
* **Render/Template**: the way to render the model as HTML

## Example
[jsfiddle Demo](https://jsfiddle.net/alex_ou/fomL88qw/)

```javascript
// The initial model
let model = 0

// the update that routes actions to the model mutators
let update = {
    //Opal passes the arguments and the model object here
	increase: function (step, model) {
  	  return model + step
	},
	decrease: function (step, model) {
  	  return model - step
	}
}

//the render function 
let render = function () {
    /* OpalJS automatically generates the action creators based on 
    the keys of the update object */
    let {increase, decrease} = this.actions
    let h = Opal.createElement
    return h('div', {}, [
      this.model,
      h('button', {'onClick': () => increase(2)}, '+'),
      h('button', {'onClick': () => decrease(2)}, '-')
    ])
  }

Opal.app({
  el: '#app', //the root DOM element
  model,
  update,
  render
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
