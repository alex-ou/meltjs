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
  props: ['text', 'completed', 'onClick'],
  template: `<li
    on-click="{onClick()}"
    bind-style="{'text-decoration': completed ? 'line-through' : 'none'}">{text}</li>`
})

Melt.component('todo-list', {
  props: ['todos', 'onTodoClick'],
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
  class: class VisibleTodoListComponent {
    getVisibleTodos () {
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
  }
})

Melt.component('todo-link', {
  props: ['active', 'onClick'],
  template: `<span>
      <span if="{active}">{children}</span>
      <a if="{!active}" href="#" on-click="handleClick">{children}</a>'
    </span>`,
  class: class TodoLinkComponent {
    handleClick (e) {
      e.preventDefault()
      this.onClick()
    }
  }
})

Melt.container('filter-link', {
  props: ['filter'],
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
    `<form on-submit="onSubmit">
      <input ref="input">
      <button type="submit"> Add Todo </button>
    </form>`,
  class: class AddTodoComponent {
    onSubmit (e) {
      e.preventDefault()
      const input = this.refs.input
      var text = input.value
      if (!text.trim()) {
        return
      }
      input.value = ''

      this.addTodo(text)
    }
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
