import {generate} from 'src/compiler/codegen'
import {parse} from 'src/compiler/ast_parser'

describe('AST parser', () => {
  it('can generate code for a single node', () => {
    let ast = parse('<span>1</span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{},["1"])')
  })

  it('can generate code for the interpolated text', () => {
    let ast = parse('<span>Hello {name}</span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{},["Hello "+(name)])')
  })

  it('can generate code for the event handler', () => {
    let ast = parse('<span on-click="{handleClick}"></span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{"onClick":(function($event){handleClick($event)}).bind(this)},[])')
  })

  it('can generate code for the event handler with params', () => {
    let ast = parse('<span on-click="{handleClick(2)}"></span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{"onClick":(function($event){handleClick(2)}).bind(this)},[])')
  })

  it('can generate the code for element with children', () => {
    let ast = parse(
      '<div class="text {color}">' +
        '<input value="1" disabled>' +
        '<a href="/link">link</a>' +
      '</div>'
    )
    let code = generate(ast)
    expect(code).toBe(
      '_h("div",{"class":"text "+(color)},' +
        '[' +
          '_h("input",{"value":"1","disabled":"disabled"},[]),' +
          '_h("a",{"href":"/link"},["link"])' +
        ']' +
      ')')
  })

  it('can generate code for the if directive', () => {
    let ast = parse('<span if="{a>0}">1</span>')
    var code = generate(ast)
    expect(code).toBe('(a>0)?_h("span",{},["1"]):null')
  })

  it('can generate code for the each directive', () => {
    let ast = parse('<span each="{n in array}">{n}</span>')
    var code = generate(ast)
    expect(code).toBe('_c(array,function(n){return _h("span",{},[(n)])})')
  })

  it('can generate code for special attributes', () => {
    let ast = parse('<span my-style.font-size="{a>0?10:20}" data-foo="foo" aria-busy="false">1</span>')
    var code = generate(ast)
    expect(code).toBe('_h("span",{"myStyle.font-size":(a>0?10:20),"data-foo":"foo","aria-busy":"false"},["1"])')
  })
})
