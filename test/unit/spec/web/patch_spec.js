import patch from 'src/web/patch'
import createElement from 'src/web/create_element'
import h from 'src/vdom/create'

function map (list, func) {
  let result = []
  for (let i = 0; i < list.length; i++) {
    result.push(func(list[i]))
  }
  return result
}

function getProp (propName) {
  return item => item[propName]
}

const innerHtml = getProp('innerHTML')
const outerHtml = getProp('outerHTML')
const tagName = getProp('tagName')

describe('patch', () => {
  it('should update the attributes', () => {
    let oldNode = h('div', {'class': 'c1'})
    let newNode = h('div', {'class': 'c2 c3'})

    let domElem = createElement(oldNode)
    expect(domElem.className).toBe('c1')
    patch(domElem, oldNode, newNode)
    expect(domElem.className).toBe('c2 c3')
  })

  it('should replace the element if the tags are different', () => {
    let oldNode = h('div', {'class': 'c1'})
    let newNode = h('span', {'class': 'c2 c3'}, [
      h('span', {}, 'text')
    ])

    let domElem = createElement(oldNode)
    expect(domElem.className).toBe('c1')

    var newDomElem = patch(domElem, oldNode, newNode)
    expect(newDomElem.className).toBe('c2 c3')
    expect(newDomElem.tagName).toBe('SPAN')
    expect(newDomElem.innerHTML).toBe('<span>text</span>')
  })

  it('should reverse the dom elements if the keys are reversed', () => {
    let oldNode = h('ul', {}, [
      h('li', {key: 1}, '1'),
      h('li', {key: 2}, '2')
    ])
    let newNode = h('ul', {}, [
      h('li', {key: 2}, '2'),
      h('li', {key: 1}, '1')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['2', '1'])
  })

  it('should append the dom elements', () => {
    let oldNode = h('ul', {}, [
      h('li', {key: 1}, '1')
    ])
    let newNode = h('ul', {}, [
      h('li', {key: 1}, '1'),
      h('li', {key: 2}, '2'),
      h('li', {key: 3}, '3'),
      h('li', {key: 4}, '4')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['1', '2', '3', '4'])
  })

  it('should prepend the dom elements', () => {
    let oldNode = h('ul', {}, [
      h('li', {key: 1}, '1')
    ])
    let newNode = h('ul', {}, [
      h('li', {key: 3}, '3'),
      h('li', {key: 2}, '2'),
      h('li', {key: 1}, '1')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['3', '2', '1'])
  })

  it('should update the elements with the same key but different tag names', () => {
    let oldNode = h('div', {}, [
      h('span', {key: 1}, '1'),
      h('span', {key: 2}, '2')
    ])
    let newNode = h('ul', {}, [
      h('span', {key: 1}, '3'),
      h('div', {key: 2}, '4')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, tagName)).toEqual(['SPAN', 'DIV'])
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['3', '4'])
  })

  it('should update the elements even without the keys', () => {
    let oldNode = h('div', {}, [
      h('span', {key: 1}, '1'),
      h('span', {key: 2}, '2')
    ])
    let newNode = h('ul', {}, [
      h('span', {}, '2'),
      h('span', {}, '1'),
      h('div', {}, '4')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, tagName)).toEqual(['SPAN', 'SPAN', 'DIV'])
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['2', '1', '4'])
  })

  it('should remove the dom elements and update the texts', () => {
    let oldNode = h('ul', {}, [
      h('li', {key: 1}, '1'),
      h('li', {key: 2}, '22'),
      h('li', {key: 3}, '3')
    ])
    let newNode = h('ul', {}, [
      h('li', {key: 2}, '2')
    ])
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, innerHtml)).toEqual(['2'])
  })

  it('should empty the parent node there are no children in the new vnode', () => {
    let oldNode = h('ul', {}, [
      h('li', {key: 1}, '1'),
      h('li', {key: 2}, '2'),
      h('li', {key: 3}, '3')
    ])
    let newNode = h('ul', {})
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(newDomElem.childNodes.length).toBe(0)
  })

  it('should replace the old node with a component', () => {
    let oldNode = h('div', {}, [
      h('span', {key: 1}, '1')
    ])

    let Counter = () => h('i', {}, 2)
    let newNode = h('div', {}, h(Counter, {key: 1}))
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, outerHtml)).toEqual(['<i>2</i>'])
  })

  it('should update the components correctly', () => {
    let Counter = ({props}) => h('i', {}, props.data)

    let oldNode = h('div', {},
      h(Counter, {key: 1, data: 'abc'})
    )
    let newNode = h('div', {},
      h(Counter, {key: 1, data: 'cde'})
    )
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, outerHtml)).toEqual(['<i>cde</i>'])
  })

  it('should update the components and the elements correctly', () => {
    let Counter = ({props}) => h('i', {}, props.data)

    let oldNode = h('div', {},
      h(Counter, {key: 1, data: 'abc'})
    )
    let newNode = h('div', {},
      h('span', {}, 'abc'),
      h(Counter, {key: 1, data: 'cde'})
    )
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, outerHtml)).toEqual(['<span>abc</span>', '<i>cde</i>'])
  })

  it('should update the components and the elements correctly even without keys', () => {
    let Counter = ({props}) => h('i', {}, props.data)

    let oldNode = h('div', {},
      h(Counter, {key: 1, data: 'abc'})
    )
    let newNode = h('div', {},
      h('span', {}, 'abc'),
      h(Counter, {data: 'cde'})
    )
    let domElem = createElement(oldNode)
    var newDomElem = patch(domElem, oldNode, newNode)
    expect(map(newDomElem.childNodes, outerHtml)).toEqual(['<span>abc</span>', '<i>cde</i>'])
  })
})

