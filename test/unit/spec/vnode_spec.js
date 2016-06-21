import h from 'src/vdom/create'
import VNode from 'src/vdom/vnode'

describe('vnode creation', () => {
  it('can create a node tree', () => {
    var tree = h('div', {}, [
      'hello',
      h('span', 'text1'),
      h('a', {href: '/link'}, 'text2')
    ])
    expect(tree).toBeDefined()
    expect(tree.tagName).toBe('div')

    expect(tree.children.length).toBe(3)

    var child = tree.children[0]
    expect(child.nodeValue).toBe('hello')
    expect(child.type).toBe(VNode.Text)

    child = tree.children[1]
    expect(child.type).toBe(VNode.Element)
    expect(child.tagName).toBe('span')

    child = tree.children[2]
    expect(child.type).toBe(VNode.Element)
    expect(child.tagName).toBe('a')
    expect(child.attrs.href).toBe('/link')
  })

  it('can create a vnode tree with function components', () => {
    let Counter = () => h('span', '1')
    let tree = h('div', {},
      h(Counter),
      h(Counter)
    )
    expect(tree).toBeDefined()
    expect(tree.children.length).toBe(2)

    let child = tree.children[0]
    expect(child.isThunk()).toBe(true)
    expect(child.renderFn()).toEqual(Counter())

    child = tree.children[1]
    expect(child.isThunk()).toBe(true)
    expect(child.renderFn()).toEqual(Counter())
  })

  it('can create a vnode three with object components', () => {
    let Counter = {
      test: 1,
      render: () => h('span', '1')
    }
    let tree = h('div', {},
      h(Counter),
      h(Counter)
    )
    expect(tree).toBeDefined()
    expect(tree.children.length).toBe(2)

    let child = tree.children[0]
    expect(child.isThunk()).toBe(true)
    expect(child.renderFn()).toEqual(Counter.render())
    expect(child.options.test).toBe(1)

    child = tree.children[1]
    expect(child.isThunk()).toBe(true)
  })
})

