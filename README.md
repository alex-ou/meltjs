# Opal.js
OpalJS is a very light framework that allows you to create web applications which have predicable behaviors and easy to test. It cuts all the unnecessary parts of web client down to three essential parts: 

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
let render = function (h) {
    /* OpalJS automatically generates the action creators based on 
    the keys of the update object */
    let {increase, decrease} = this.actions

    return h('div', {}, [
      this.model,
      h('button', {'onClick': () => increase(2)}, '+'),
      h('button', {'onClick': () => decrease(2)}, '-')
    ])
  }

Opal.app({
  el: '#app', //root DOM element
  model,
  update,
  render
})

```
## Features
### Duo-way Rendering - JSX and Templates
JSX is very flexible, a lot of developers like this way to create the UI. Under the hood, Opal uses virtual DOM to represent the DOM structure, and it's fully compatible with JSX, so you can create the view in React way. 
On the other hand, templates are very clean and concise, consider the following example, you can tell with a glimpse that it'll render into a list:

```html
<ul>
<li for={item in items}></li>
</ul>
```
Opal will also support the template rendering with some predefined angular-like directives, e.g. `for`, `if`, `ref` etc. All the templates will be compiled into virtual DOM so it'll be transparent to developers. (Template rendering is still work in progress)
### Component design
Opal supports two kinds of components: stateless function components and components with states
### One way data flow
Opal enforces one way data flow, in the view, if you want to change the model, actions have to be used to dispatch the data. this is to help maintain a predicable application state and improve the performance