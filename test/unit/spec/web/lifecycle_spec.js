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

  it('onUpdate should be called when the node is re-rendered', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      onUpdate: jasmine.createSpy('onUpdate')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(Parent)
      ])
    )
    let newNode = h('div', {},
      h('div', {}, [
        h(Parent)
      ])
    )
    const domElem = createElement(oldNode)
    expect(Parent.onUpdate).not.toHaveBeenCalled()

    patch(domElem, oldNode, newNode)
    expect(Parent.onUpdate).toHaveBeenCalled()
  })

  it('lifecycle hooks should be called when the component is replaced', () => {
    const ComponentA = {
      render: function () {
        return h('div', {})
      },
      onMount: jasmine.createSpy('ComponentA_onMount'),
      onUnmount: jasmine.createSpy('ComponentA_onUnmount')
    }
    const ComponentB = {
      render: function () {
        return h('div', {})
      },
      onMount: jasmine.createSpy('ComponentB_onMount'),
      onUpdate: jasmine.createSpy('ComponentB_onUpdate'),
      onUnmount: jasmine.createSpy('ComponentB_onUnmount')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(ComponentA)
      ])
    )
    let newNode = h('div', {},
      h('div', {}, [
        h(ComponentB)
      ])
    )
    let domElem = createElement(oldNode)
    expect(ComponentA.onMount).toHaveBeenCalled()

    domElem = patch(domElem, oldNode, newNode)
    expect(ComponentA.onUnmount).toHaveBeenCalled()
    expect(ComponentB.onMount).toHaveBeenCalled()
    expect(ComponentB.onUpdate).not.toHaveBeenCalled()

    let anotherNewNode = h('div', {},
      h('div', {}, [
        h(ComponentB, {a: 1}),
        h('span', {}, 'test')
      ])
    )
    patch(domElem, newNode, anotherNewNode)
    expect(ComponentB.onUpdate).toHaveBeenCalled()
  })
})
