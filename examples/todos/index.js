let nextId = 0
function addTodo ({model}, text) {
  const todos = [
    ...model.todos,
    {
      id: nextId++,
      text: text,
      completed: false
    }]
  return Object.assign({}, model, {todos})
}

function toggleTodo ({model}, id) {
  const todos = model.todos.map(todo => {
    if (todo.id !== id) {
      return todo
    }

    return {
      id: todo.id,
      text: todo.text,
      completed: !todo.completed
    }
  })
  return Object.assign({}, model, {todos})
}

function setVisibilityFilter ({model}, visibilityFilter) {
  return Object.assign({}, model, {visibilityFilter})
}

Melt.component('todo', {
  inputs: ['text', 'completed', 'onClick'],
  template: `<li
    on-click="{onClick()}"
    class="{completed ? 'done' : ''}">{text}</li>`
})

Melt.component('todo-list', {
  inputs: ['todos', 'onTodoClick'],
  template:
    `<ul>
      <todo each="item in todos"
        key="{item.id}"
        completed="{item.completed}"
        text="{item.text}"
        on-click="{onTodoClick(item.id)}">
      </todo>
    </ul>`
})

Melt.container('visible-todo-list', {
  template: '<todo-list todos="{getVisibleTodos()}" on-todo-click="{toggleTodo}"></todo-list>',
  getVisibleTodos: function () {
    const {visibilityFilter, todos} = this.model
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_ACTIVE':
        return todos.filter(todo => !todo.completed)
      case 'SHOW_COMPLETED':
        return todos.filter(todo => todo.completed)
      default:
        throw new Error('unsupported filter:' + visibilityFilter)
    }
  }
})

Melt.component('todo-link', {
  inputs: ['active', 'onClick'],
  template: `<span>
      <span if="{active}">{children}</span>
      <a if="{!active}" href="#" on-click="handleClick">{children}</a>'
    </span>`,
  handleClick: function (e) {
    e.preventDefault()
    this.onClick()
  }
})

Melt.container('filter-link', {
  inputs: ['filter'],
  template: '<todo-link active="{filter === model.visibilityFilter}" on-click="setVisibilityFilter(filter)">{children}</todo-link>'
})

Melt.component('footer', {
  template: `
  <p>
    Show:
    {" "}
    <filter-link filter="SHOW_ALL">
      All
    </filter-link>
    {", "}
    <filter-link filter="SHOW_ACTIVE">
      Active
    </filter-link>
    {", "}
    <filter-link filter="SHOW_COMPLETED">
      Completed
    </filter-link>
  </p>`
})

Melt.container('add-todo', {
  template:
    `<form on-submit="{onSubmit}">
      <input on-input="{onInput}" ref="theInput">
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
      <visible-todo-list></visible-todo-list>
      <footer></footer>
    </div>`
})

Melt.app({
  el: '#app',
  template: '<app></app>',
  model: {
    todos: [],
    visibilityFilter: 'SHOW_ALL'
  },
  update: {
    addTodo,
    toggleTodo,
    setVisibilityFilter
  }
})
