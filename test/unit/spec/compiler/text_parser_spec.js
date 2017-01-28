import parse from 'src/compiler/text_parser'
import {AstTokenType} from 'src/compiler/ast_type'

describe('text parser', () => {
  it('can parse string literal', () => {
    let tokens = parse('abc')
    expect(tokens).toEqual([{
      token: 'abc',
      type: AstTokenType.Literal
    }])
  })

  it('can parse expression', () => {
    let tokens = parse('{abc}{}')
    expect(tokens).toEqual([{
      token: 'abc',
      type: AstTokenType.Expr
    }, {
      token: '',
      type: AstTokenType.Expr
    }])
  })

  it('can parse expression and literal string', () => {
    let tokens = parse('foo{bar + 1}baz')
    expect(tokens).toEqual([{
      token: 'foo',
      type: AstTokenType.Literal
    }, {
      token: 'bar + 1',
      type: AstTokenType.Expr
    }, {
      token: 'baz',
      type: AstTokenType.Literal
    }])
  })

  it('can parse object literal expression', () => {
    let tokens = parse('{{foo: 1, bar: 2}}')
    expect(tokens).toEqual([{
      token: '{foo: 1, bar: 2}',
      type: AstTokenType.Expr
    }])
  })
})
