import createElement from 'src/web/create_element'
import h, {registerComponent, clearComponenetRegistry} from 'src/web/component'

describe('createElement', () => {
  beforeEach(() => {
    clearComponenetRegistry()
  })

  it('should create a single element', () => {
    var vtree = h('div', {'class': 'test'})
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
  })

  it('Utility functions should exist in the render function of the components', () => {
    registerComponent('counter', {
      render: function () {
        expect(this.createElement).toBeDefined()
        expect(this._h).toBeDefined()
        expect(this._c).toBeDefined()
        expect(this.range).toBeDefined()

        const h = this.createElement
        return h('span')
      }
    })
    var vtree = h('div', {'class': 'test'},
      h('counter')
    )
    createElement(vtree)
  })

  it('should create the components', () => {
    registerComponent('counter', {
      render: function () {
        return h('span', {'class': 'my-span1'}, 'span1')
      }
    })
    registerComponent('counter1', {
      render: function () {
        return h('span', {'class': 'my-span2'}, 'span2')
      }
    })

    var vtree = h('div', {'class': 'test'},
      h('counter'),
      h('counter1')
    )
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
    expect(node.children.length).toBe(2)
    let child = node.children[0]
    expect(child.tagName).toBe('SPAN')
    expect(child.className).toBe('my-span1')
    expect(child.textContent).toBe('span1')

    child = node.children[1]
    expect(child.tagName).toBe('SPAN')
    expect(child.className).toBe('my-span2')
    expect(child.textContent).toBe('span2')
  })

  it('should have access to the props in the render function', () => {
    registerComponent('counter', {
      render: function () {
        var {foo, bar} = this.props
        return h('span', {'class': foo}, bar)
      }
    })

    var bar = 'bar'
    var vtree = h('div', {'class': 'test'},
      h('counter', {'foo': 'foo', 'bar': bar})
    )
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
    expect(node.children.length).toBe(1)
    let child = node.children[0]
    expect(child.tagName).toBe('SPAN')
    expect(child.className).toBe('foo')
    expect(child.textContent).toBe('bar')
  })

  it('should have access to the props in the template', () => {
    registerComponent('counter', {
      template: '<span class="{foo}">{bar}</span>'
    })

    var bar = 'bar'
    var vtree = h('div', {'class': 'test'},
      h('counter', {'foo': 'foo', 'bar': bar})
    )
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
    expect(node.children.length).toBe(1)
    let child = node.children[0]
    expect(child.tagName).toBe('SPAN')
    expect(child.className).toBe('foo')
    expect(child.textContent).toBe('bar')
  })
})
