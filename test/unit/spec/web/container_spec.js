import {registerComponent, registerContainer, instantiateComponent, clearComponenetRegistry} from 'src/web/component'

describe('Container', () => {
  beforeEach(() => {
    clearComponenetRegistry()
  })

  it('should have access to the context data', () => {
    registerContainer('container1', {
      inputs: [],
      template: '<span>{foo}</span>'
    })

    registerContainer('container2', {
      inputs: [],
      template: '<span>{bar}</span>'
    })

    const app = registerContainer('app', {
      template: '<div><container1></container1><container2></container2></div>'
    })
    const component = instantiateComponent(app)
    var dom = component.patch({foo: 'foo', bar: 'bar'})
    expect(dom.tagName).toBe('DIV')
    expect(dom.innerHTML).toBe('<span>foo</span><span>bar</span>')
  })

  it('should have access to the context data as child component', () => {
    registerContainer('container', {
      inputs: [],
      template: '<sub-component></sub-component>'
    })

    registerComponent('sub-component', {
      inputs: [],
      template: '<sub-container></sub-container>'
    })

    registerContainer('sub-container', {
      inputs: [],
      template: '<span>{bar}</span>'
    })

    const app = registerContainer('app', {
      template: '<div><container></container></div>'
    })
    const component = instantiateComponent(app)
    let dom = component.patch({foo: 'foo', bar: 'bar'})
    expect(dom.tagName).toBe('DIV')
    expect(dom.innerHTML).toBe('<span>bar</span>')

    dom = component.patch({bar: 'bar1'})
    expect(dom.innerHTML).toBe('<span>bar1</span>')
  })
})
