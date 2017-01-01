import {parse} from 'src/compiler/ast_parser'
import {AstElementType, AstTokenType} from 'src/compiler/ast_type'

// Flatten the attrs
function flatten (attrs) {
  var flatenTokens = tokens => {
    return (tokens || []).map(
      item => item.type === AstTokenType.Literal ? item.token : `_s(${item.token})`
    ).join('+')
  }
  var result = {}
  for (var key in attrs) {
    result[key] = flatenTokens(attrs[key].tokens)
  }
  return result
}

describe('AST parser', () => {
  it('can parse a single node', () => {
    let root = parse('<span class="text">1</span>')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('span')
    expect(root.children.length).toBe(1)
    expect(root.children[0].type).toBe(AstElementType.Text)
    expect(root.children[0].tokens[0]).toEqual({ token: '1', type: AstTokenType.Literal })
    expect(flatten(root.attributes)).toEqual({'class': 'text'})
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
    expect(child.tokens[0]).toEqual({ token: '1', type: AstTokenType.Literal })
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
    expect(child.tokens[0]).toEqual({ token: '1', type: AstTokenType.Literal })
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
    expect(flatten(root.attributes)).toEqual({'class': 'text'})
    expect(root.children.length).toBe(3)

    let child
    child = root.children[0]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.tagName).toBe('input')
    expect(flatten(child.attributes)).toEqual({value: '1', 'disabled': 'disabled'})

    child = root.children[1]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.children[0].type).toBe(AstElementType.Text)
    expect(child.children[0].tokens[0]).toEqual({ token: 'text', type: AstTokenType.Literal })

    child = root.children[2]
    expect(child.type).toBe(AstElementType.Element)
    expect(child.children[0].type).toBe(AstElementType.Element)
    expect(flatten(child.children[0].attributes)).toEqual({href: '/link'})
  })

  it('parses the text element and wraps it with a span', () => {
    let root = parse('aabb')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('span')
    expect(root.children.length).toBe(1)
    expect(root.children[0].tokens[0]).toEqual({ token: 'aabb', type: AstTokenType.Literal })
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
    expect(flatten(root.attributes)).toEqual({class: 'text\''})
  })

  it('can parse interpolated text', () => {
    let root = parse('<span>My name is {firstName} {lastName}</span>')
    expect(root).toBeDefined()
    expect(root.tagName).toBe('span')
    expect(root.children.length).toBe(1)
    expect(root.children[0].type).toBe(AstElementType.Text)
    expect(root.children[0].tokens).toEqual([
      {token: 'My name is ', type: AstTokenType.Literal},
      {token: 'firstName', type: AstTokenType.Expr},
      {token: ' ', type: AstTokenType.Literal},
      {token: 'lastName', type: AstTokenType.Expr}
    ])
  })

  it('should ignore the leading and trailing whitespaces that are in in pre element', () => {
    let root = parse(`
      <div>
        <span>1</span>
      </div>
    `)
    expect(root).toBeDefined()
    expect(root.tagName).toBe('div')
    expect(root.children[0].tagName).toBe('span')
    expect(root.children[0].children[0].rawValue).toBe('1')
  })

  it('should preserve the leading and trailing whitespaces for pre element', () => {
    let root = parse(`<pre><span> 1 </span>
      </pre>`)
    expect(root).toBeDefined()
    expect(root.tagName).toBe('pre')
    expect(root.children.length).toBe(2)
    expect(root.children[0].tagName).toBe('span')
    expect(root.children[0].children[0].rawValue).toBe(' 1 ')
    expect(root.children[1].type).toBe(AstElementType.Text)
  })

  describe('Invalid scenarios', () => {
    it('should ignore the invalid if directive', () => {
      let root = parse('<span if="{df} a">1</span>')
      expect(flatten(root.attributes)).toEqual({})
    })
  })
})
