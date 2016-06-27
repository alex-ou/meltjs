import {generate} from 'src/compiler/codegen'
import {parse} from 'src/compiler/ast_parser'

describe('AST parser', () => {
  it('can generate code for a single node', () => {
    let ast = parse('<span>1</span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{},["1"])')
  })

  it('can generate the code for element with children', () => {
    let ast = parse(
      '<div class="text">' +
        '<input value="1" disabled>' +
        '<a href="/link">link</a>' +
      '</div>'
    )
    let code = generate(ast)
    expect(code).toBe(
      '_h("div",{"class":"text"},' +
        '[' +
          '_h("input",{"value":"1","disabled":"disabled"},[]),' +
          '_h("a",{"href":"/link"},["link"])' +
        ']' +
      ')')
  })
})
