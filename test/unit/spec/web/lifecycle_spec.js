import patch from 'src/web/patch'
import createDomElement from 'src/web/create_dom'
import h from 'src/vdom/create'

describe('lifecycle', () => {
  it('mounted should be called when the component is rendered', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      mounted: jasmine.createSpy('mounted')
    }

    let oldNode = h('div', {},
      h(Parent, {key: 1, data: 'abc'})
    )
    createDomElement(oldNode)
    expect(Parent.mounted).toHaveBeenCalled()
  })

  it('mounted should be called when child components are rendered', () => {
    const Child1 = {
      render: function () {
        return h('i', {}, 'child')
      },
      mounted: jasmine.createSpy('mounted')
    }

    const Child2 = {
      render: function () {
        return h('i', {}, 'child2')
      },
      mounted: jasmine.createSpy('mounted')
    }

    const Parent = {
      render: function () {
        return h('div', {}, [
          h(Child1, {}),
          h(Child2, {})
        ])
      },
      mounted: jasmine.createSpy('mounted')
    }

    let oldNode = h('div', {},
      h(Parent, {key: 1, data: 'abc'})
    )
    createDomElement(oldNode)
    expect(Child1.mounted).toHaveBeenCalled()
    expect(Child2.mounted).toHaveBeenCalled()
  })

  it('unmounted should be called when the node is removed', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      unmounted: jasmine.createSpy('unmounted')
    }

    let oldNode = h('div', {},
      h('div', {}, [
        h(Parent, {key: 1, data: 'abc'})
      ])
    )
    let newNode = h('div', {})
    const domElem = createDomElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.unmounted).toHaveBeenCalled()
  })

  it('unmounted should be called when the node is replaced', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      unmounted: jasmine.createSpy('unmounted')
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
    const domElem = createDomElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.unmounted).toHaveBeenCalled()
  })

  it('unmounted should be called when the node is removed from the children', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      unmounted: jasmine.createSpy('unmounted')
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
    const domElem = createDomElement(oldNode)
    patch(domElem, oldNode, newNode)
    expect(Parent.unmounted).toHaveBeenCalled()
  })

  it('updated should be called when the node is re-rendered', () => {
    const Parent = {
      render: function () {
        return h('div', {})
      },
      updated: jasmine.createSpy('updated')
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
    const domElem = createDomElement(oldNode)
    expect(Parent.updated).not.toHaveBeenCalled()

    patch(domElem, oldNode, newNode)
    expect(Parent.updated).toHaveBeenCalled()
  })

  it('lifecycle hooks should be called when the component is replaced', () => {
    const ComponentA = {
      render: function () {
        return h('div', {})
      },
      mounted: jasmine.createSpy('ComponentA_mounted'),
      unmounted: jasmine.createSpy('ComponentA_unmounted')
    }
    const ComponentB = {
      render: function () {
        return h('div', {})
      },
      mounted: jasmine.createSpy('ComponentB_mounted'),
      updated: jasmine.createSpy('ComponentB_updated'),
      unmounted: jasmine.createSpy('ComponentB_unmounted')
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
    let domElem = createDomElement(oldNode)
    expect(ComponentA.mounted).toHaveBeenCalled()

    domElem = patch(domElem, oldNode, newNode)
    expect(ComponentA.unmounted).toHaveBeenCalled()
    expect(ComponentB.mounted).toHaveBeenCalled()
    expect(ComponentB.updated).not.toHaveBeenCalled()

    let anotherNewNode = h('div', {},
      h('div', {}, [
        h(ComponentB, {a: 1}),
        h('span', {}, 'test')
      ])
    )
    patch(domElem, newNode, anotherNewNode)
    expect(ComponentB.updated).toHaveBeenCalled()
  })
})
