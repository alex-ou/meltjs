let nextId = 0
function addTodo (text, model) {
  return [
    ...model,
    {
      id: nextId++,
      text: text,
      completed: false
    }]
}

Melt.component('app', {
  inputs: ['todos'],
  template: `
    <ul>
      <todo each="todo in todos" key="{todo.id}">
      </todo>
    </ul>
  `
})

Melt.app({
  el: '#app',
  template: '',
  model: [],
  update: {
    addTodo
  }
})
