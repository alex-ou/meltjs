import {createComponent} from 'src/web/component'

describe('style', () => {
  it('should set styles of the dom element', () => {
    let _style = {color: 'red', height: '40px'}
    const component = createComponent({
      template: `
          <div>
            <span style="{getStyle()}">test</span>
          </div>
        `,
      getStyle: () => _style
    })
    component.patch()
    expect(component.elem).toBeDefined()
    const span = component.elem.children[0]
    expect(span.style.color).toEqual('red')
    expect(span.style.height).toEqual('40px')

    _style = {color: 'black', height: '20px'}
    component.patch()
    expect(span.style.color).toEqual('black')
    expect(span.style.height).toEqual('20px')
  })
})
