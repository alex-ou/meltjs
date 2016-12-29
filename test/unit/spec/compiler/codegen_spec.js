import * as util from 'src/util/index'
import {generate} from 'src/compiler/codegen'
import {parse} from 'src/compiler/ast_parser'

describe('AST parser', () => {
  beforeEach(() => {
    spyOn(util, 'uniqueId').and.returnValue(1)
  })
  it('can generate code for a single node', () => {
    let ast = parse('<span>1</span>')
    var code = generate(ast)[1]
    expect(code).toBe('_h("span",{},["1"])')
  })

  it('can generate code for the interpolated text', () => {
    let ast = parse('<span>Hello {name}</span>')
    var code = generate(ast)[1]
    expect(code).toBe('_h("span",{},["Hello "+name])')
  })

  it('can generate code for the event handler', () => {
    let ast = parse('<span on-click="{handleClick}"></span>')
    var code = generate(ast)
    expect(code[0]).toBe('var $$eh_1=function($event){handleClick($event)};')
    expect(code[1]).toBe('_h("span",{"onClick":$$eh_1},[])')
  })

  it('can generate code for the event handler with params', () => {
    let ast = parse('<span on-click="{handleClick(2)}"></span>')
    var code = generate(ast)
    expect(code[0]).toBe('var $$eh_1=function($event){handleClick(2)};')
    expect(code[1]).toBe('_h("span",{"onClick":$$eh_1},[])')
  })

  it('can generate the code for element with children', () => {
    let ast = parse(
      '<div class="text {color}">' +
        '<input value="1" disabled>' +
        '<a href="/link">link</a>' +
      '</div>'
    )
    let code = generate(ast)[1]
    expect(code).toBe(
      '_h("div",{"class":"text "+color},' +
        '[' +
          '_h("input",{"value":"1","disabled":"disabled"},[]),' +
          '_h("a",{"href":"/link"},["link"])' +
        ']' +
      ')')
  })
})
