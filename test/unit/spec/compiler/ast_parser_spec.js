import {parse, AstElementType} from 'src/compiler/ast_parser'

describe('AST parser', () => {
  it('can parse a single node', () => {
    let root = parse('<span class="text">1</span>')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('span')
    expect(root.children.length).toBe(1)
    expect(root.children[0].type).toBe(AstElementType.Text)
    expect(root.children[0].text).toBe('1')
    expect(root.attributes).toEqual({'class': 'text'})
  })

  it('can parse the unclosed outer element', () => {
    let root = parse('<div><span>1</span>')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('div')
    expect(root.children.length).toBe(1)
    let child = root.children[0]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.tagName).toBe('span')
    child = child.children[0]
    expect(child.type).toBe(AstElementType.Text)
    expect(child.text).toBe('1')
  })

  it('can parse the unclosed inner element', () => {
    let root = parse('<div><span>1</div>')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('div')
    expect(root.children.length).toBe(1)
    let child = root.children[0]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.tagName).toBe('span')
    child = child.children[0]
    expect(child.type).toBe(AstElementType.Text)
    expect(child.text).toBe('1')
  })

  it('can parse the element with children', () => {
    let root = parse(
      '<div class="text">' +
        '<input value="1" disabled>' +
        '<span>text</span>' +
        '<div>' +
          '<a href="/link">link</a>' +
        '</div>' +
      '</div>'
    )
    expect(root).toBeDefined()
    expect(root.tagName).toBe('div')
    expect(root.attributes).toEqual({'class': 'text'})
    expect(root.children.length).toBe(3)

    let child
    child = root.children[0]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.tagName).toBe('input')
    expect(child.attributes).toEqual({value: '1', 'disabled': 'disabled'})

    child = root.children[1]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.children[0].type).toBe(AstElementType.Text)
    expect(child.children[0].text).toBe('text')

    child = root.children[2]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.children[0].type).toBe(AstElementType.Element)
    expect(child.children[0].attributes).toEqual({href: '/link'})
  })

  it('parses the text element and wraps it with a span', () => {
    let root = parse('aabb')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('span')
    expect(root.children.length).toBe(1)
    expect(root.children[0].text).toBe('aabb')
  })

  it('throws exception if there are more then one root elements', () => {
    expect(() => {
      parse('<span></span><span></span>')
    }).toThrow()

    expect(() => {
      parse('<span></span>aabb')
    }).toThrow()
  })

  it('should not allow script or style tag', () => {
    expect(() => {
      parse('<script></script>')
    }).toThrow()
    expect(() => {
      parse('<style></style>')
    }).toThrow()
  })

  it('can parse attributes with special chars', () => {
    let root = parse('<span class="text\'">1</span>')
    expect(root.attributes['class']).toBe('text\'')
  })
})
