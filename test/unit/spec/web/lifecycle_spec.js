import patch from 'src/web/patch'
import createElement from 'src/web/create_element'
import h from 'src/vdom/create'

describe('lifecycle', () => {
  it('onMount should be called when the component is rendered', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      onMount: jasmine.createSpy('onMount')
    }

    let oldNode = h('div', {},
      h(Parent, {key: 1, data: 'abc'})
    )
    createElement(oldNode)
    expect(Parent.onMount).toHaveBeenCalled()
  })

  it('onMount should be called when child components are rendered', () => {
    const Child1 = {
      render: function () {
        return h('i', {}, 'child')
      },
      onMount: jasmine.createSpy('onMount')
    }

    const Child2 = {
      render: function () {
        return h('i', {}, 'child2')
      },
      onMount: jasmine.createSpy('onMount')
    }

    const Parent = {
      render: function () {
        return h('div', {}, [
          h(Child1, {}),
          h(Child2, {})
        ])
      },
      onMount: jasmine.createSpy('onMount')
    }

    let oldNode = h('div', {},
      h(Parent, {key: 1, data: 'abc'})
    )
    createElement(oldNode)
    expect(Child1.onMount).toHaveBeenCalled()
    expect(Child2.onMount).toHaveBeenCalled()
  })

  it('onUnmount should be called when the node is removed', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      onUnmount: jasmine.createSpy('onUnmount')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(Parent, {key: 1, data: 'abc'})
      ])
    )
    let newNode = h('div', {})
    const domElem = createElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.onUnmount).toHaveBeenCalled()
  })

  it('onUnmount should be called when the node is replaced', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      onUnmount: jasmine.createSpy('onUnmount')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(Parent, {data: 'abc'})
      ])
    )
    let newNode = h('div', {},
      h('div', {}, [
        h('span', {data: 'abc'})
      ])
    )
    const domElem = createElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.onUnmount).toHaveBeenCalled()
  })

  it('onUnmount should be called when the node is removed from the children', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      onUnmount: jasmine.createSpy('onUnmount')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(Parent, {key: '1'}),
        h('span', {key: '2'})
      ])
    )
    let newNode = h('div', {},
      h('div', {}, [
        h('span', {key: '2'})
      ])
    )
    const domElem = createElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.onUnmount).toHaveBeenCalled()
  })
})
