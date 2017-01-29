import {registerComponent, registerContainer, clearRegistry, createComponent} from 'src/web/component'

describe('Container', () => {
  beforeEach(() => {
    clearRegistry()
  })

  it('should have access to the context data', () => {
    registerContainer('container1', {
      template: '<span>{foo}</span>'
    })

    registerContainer('container2', {
      template: '<span>{bar}</span>'
    })

    const app = registerContainer('app', {
      template: '<div><container1></container1><container2></container2></div>'
    })
    const component = createComponent(app)
    var dom = component.patch({foo: 'foo', bar: 'bar'})
    expect(dom.tagName).toBe('DIV')
    expect(dom.innerHTML).toBe('<span>foo</span><span>bar</span>')
  })

  it('should have access to the context data as child component', () => {
    registerContainer('container', {
      template: '<sub-component></sub-component>'
    })

    registerComponent('sub-component', {
      template: '<sub-container></sub-container>'
    })

    registerContainer('sub-container', {
      template: '<span>{bar}</span>'
    })

    const app = registerContainer('app', {
      template: '<div><container></container></div>'
    })
    const component = createComponent(app)
    let dom = component.patch({foo: 'foo', bar: 'bar'})
    expect(dom.tagName).toBe('DIV')
    expect(dom.innerHTML).toBe('<span>bar</span>')

    dom = component.patch({bar: 'bar1'})
    expect(dom.innerHTML).toBe('<span>bar1</span>')
  })
})
