import createElement from 'src/web/create_element'
import h, {registerComponent, registerContainer, instantiateComponent, clearComponenetRegistry} from 'src/web/component'

describe('Component', () => {
  beforeEach(() => {
    clearComponenetRegistry()
  })

  it('should provide utility functions in the render function', () => {
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

  it('should provide the props to the render function', () => {
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

  it('should provide the props to the template', () => {
    registerComponent('counter', {
      inputs: ['foo', 'bar'],
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

  it('should have access to the children property in the template', () => {
    registerComponent('my-link', {
      template: '<a href="#">{children}</a>'
    })

    const app = registerComponent('app', {
      template: '<my-link><span>my link</span></my-link>'
    })
    var node = instantiateComponent(app).patch()
    expect(node.tagName).toBe('A')
    expect(node.children.length).toBe(1)
    let child = node.children[0]
    expect(child.tagName).toBe('SPAN')
    expect(child.textContent).toBe('my link')
  })

  it('should convert the property names to camel case', () => {
    registerComponent('my-link', {
      inputs: ['first', 'secondWord', 'yetAnotherWord'],
      template: '<span>{first} {secondWord} {yetAnotherWord}</span>'
    })

    const app = registerComponent('app', {
      template: '<my-link first="first" second-word="second" yet-another-word="yet"></my-link>'
    })
    var node = instantiateComponent(app).patch()
    expect(node.textContent).toBe('first second yet')
  })

  it('should not have access to the context data', () => {
    registerComponent('child', {
      inputs: [],
      template: '<span>{data}</span>'
    })

    const app = registerContainer('app', {
      template: '<child></child>'
    })
    expect(() => instantiateComponent(app).patch({data: 1})).toThrow()
  })
})
