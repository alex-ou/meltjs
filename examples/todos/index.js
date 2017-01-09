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

function toggleTodo ({model}, id) {
  return model.map(todo => {
    if (todo.id !== id) {
      return todo
    }

    return {
      id: todo.id,
      text: todo.text,
      completed: !todo.completed
    }
  })
}

Melt.component('todo', {
  inputs: ['text', 'completed', 'onClick', 'todoId'],
  template: '<li on-click="{onClick()}" class="{getClass()}">{text} {todoId}</li>',
  getClass: function () {
    return this.completed ? 'done' : ''
  }
})

Melt.component('todo-list', {
  inputs: ['todos', 'onTodoClick'],
  template:
    `<ul>
      <todo each="item in todos" key="{item.id}" todo-id="{item.id}" completed="{item.completed}" text="{item.text}" on-click="{handleClick(item)}"></todo>
    </ul>`,
  handleClick: function (item) {
    console.log('alex:', item)
    this.onTodoClick(item.id)
  }
})

Melt.container('visible-todo-list', {
  template: '<div></div>'
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
      <todo-list todos="{model}" on-todo-click="{toggleTodo}"></todo-list>
    </div>`
})

Melt.app({
  el: '#app',
  template: '<app></app>',
  model: [],
  update: {
    addTodo,
    toggleTodo
  }
})
