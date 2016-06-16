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
})
