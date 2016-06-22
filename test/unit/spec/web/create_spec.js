import createElement from 'src/web/create_element'
import h from 'src/vdom/create'

describe('createElement', () => {
  it('should create a single element', () => {
    var vtree = h('div', {'class': 'test'})
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
  })

  it('should create an element with children', () => {
    var vtree = h('div', {'class': 'test'}, [
      h('span', {'color': 'red'}, 'span text'),
      h('a', {'href': '/link'})
    ])
    var node = createElement(vtree)
    expect(node.tagName).toBe('DIV')
    expect(node.className).toBe('test')
    expect(node.childNodes.length).toBe(2)

    var child = node.childNodes[0]
    expect(child.tagName).toBe('SPAN')
    expect(child.getAttribute('color')).toBe('red')
    expect(child.textContent).toBe('span text')

    child = node.childNodes[1]
    expect(child.tagName).toBe('A')
    expect(child.getAttribute('href')).toBe('/link')
  })

  it('should create an element with null', () => {
    var vtree = h('div', {}, null)
    var node = createElement(vtree)
    expect(node.innerHTML).toBe('<noscript></noscript>')
  })

  it('should create an input with value', () => {
    var vtree = h('input', {value: 10})
    var node = createElement(vtree)
    expect(node.value).toBe('10')
  })

  it('can create elements for components', () => {
    let Counter = () => h('span', null, '1')
    let vtree = h('div', {},
      h(Counter),
      h(Counter)
    )
    var node = createElement(vtree)
    expect(node.childNodes.length).toBe(2)
    expect(node.childNodes[0].outerHTML).toBe('<span>1</span>')
    expect(node.childNodes[1].outerHTML).toBe('<span>1</span>')
  })

  it('can pass in props to stateless components', () => {
    let Counter = ({props}) => h('span', null, props.count)
    let vtree = h('div', {},
      h(Counter, {count: 2}),
      h(Counter, {count: 3})
    )
    var node = createElement(vtree)
    expect(node.childNodes.length).toBe(2)
    expect(node.childNodes[0].outerHTML).toBe('<span>2</span>')
    expect(node.childNodes[1].outerHTML).toBe('<span>3</span>')
  })

  it('can pass in children to stateless components', () => {
    let Counter = ({children}) => h('div', null, children)
    let vtree = h('div', {},
      h(Counter, {}, h('span', {}, 2)),
      h(Counter, {}, h('span', {}, 3))
    )
    var node = createElement(vtree)
    expect(node.childNodes.length).toBe(2)
    expect(node.childNodes[0].outerHTML).toBe('<div><span>2</span></div>')
    expect(node.childNodes[1].outerHTML).toBe('<div><span>3</span></div>')
  })

  it('can pass in children to components with state', () => {
    let Counter = {
      test: function () { return this.props.count + 1 },
      render: function () {
        return h('span', {}, this.test())
      }
    }
    let vtree = h('div', {},
      h(Counter, {count: 1}),
      h(Counter, {count: 2})
    )
    var node = createElement(vtree)
    expect(node.childNodes.length).toBe(2)
    expect(node.childNodes[0].outerHTML).toBe('<span>2</span>')
    expect(node.childNodes[1].outerHTML).toBe('<span>3</span>')
  })
})
