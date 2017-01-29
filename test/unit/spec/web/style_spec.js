import {createComponent} from 'src/web/component'

describe('style', () => {
  it('should set styles of the dom element', () => {
    const component = createComponent({
      template: `
          <div>
            <span style="{getStyle()}">test</span>
          </div>
        `,
      class: function () {
        this.getStyle = function () {
          return this._style
        }
        this.setStyle = function (style) {
          this._style = style
        }
      }
    })
    component.setStyle({color: 'red', height: '40px'})
    component.patch()
    expect(component.elem).toBeDefined()
    const span = component.elem.children[0]
    expect(span.style.color).toEqual('red')
    expect(span.style.height).toEqual('40px')

    component.setStyle({color: 'black', height: '20px'})
    component.patch()
    expect(span.style.color).toEqual('black')
    expect(span.style.height).toEqual('20px')
  })
})
