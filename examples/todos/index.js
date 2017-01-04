let nextId = 0
function addTodo ({model}, text) {
  return [
    ...model,
    {
      id: nextId++,
      text: text,
      completed: false
    }]
}

Melt.component('todo', {
  inputs: ['text'],
  template: '<li>{text}</li>'
})

Melt.component('todo-list', {
  inputs: ['todos'],
  template:
    `<ul>
      <todo each="item in todos" text="{item.text}"></todo>
    </ul>`
})

Melt.container('add-todo', {
  template:
    `<form on-submit="{onSubmit}">
      <input on-input="{onInput}">
      <button type="submit"> Add Todo </button>
    </form>`,

  onInput: function (e) {
    this.inputText = e.target.value
  },
  onSubmit: function (e) {
    e.preventDefault()
    if (!this.inputText.trim()) {
      return
    }
    this.addTodo(this.inputText)
  }
})

Melt.container('app', {
  template:
    `<div>
      <add-todo></add-todo>
      <todo-list todos="{model}"></todo-list>
    </div>`
})

Melt.app({
  el: '#app',
  template: '<app></app>',
  model: [],
  update: {
    addTodo
  }
})
