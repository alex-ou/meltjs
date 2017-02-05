import {createComponent} from 'src/web/component'

describe('Class directive', () => {
  it('accepts array as the binding value', () => {
    const component = createComponent({
      template: `
          <div>
            <span class.*="{['foo', 'bar']}">test</span>
          </div>
        `
    })
    component.patch()
    expect(component.elem).toBeDefined()
    const span = component.elem.children[0]
    expect(span.className).toEqual('foo bar')
  })

  it('accepts string as the binding value', () => {
    const component = createComponent({
      template: `
          <div>
            <span class.*="{'foo bar'}">test</span>
          </div>
        `
    })
    component.patch()
    expect(component.elem).toBeDefined()
    const span = component.elem.children[0]
    expect(span.className).toEqual('foo bar')
  })

  it('accepts object as the binding value', () => {
    const component = createComponent({
      template: `
          <div>
            <span class.*="{{'visible': _isVisible}}">test</span>
          </div>
        `,
      class: class {
        setVisible (yes) {
          this._isVisible = yes
        }
      }
    })
    component.setVisible(true)
    component.patch()
    expect(component.elem).toBeDefined()
    let span = component.elem.children[0]
    expect(span.className).toEqual('visible')

    component.setVisible(false)
    component.patch()
    expect(component.elem).toBeDefined()
    span = component.elem.children[0]
    expect(span.className).toEqual('')
  })

  it('does not affect the existing class attribute', () => {
    const component = createComponent({
      template: `
          <div>
            <span class="foo bar" class.*="{'test'}">test</span>
          </div>
        `
    })
    component.patch()
    expect(component.elem).toBeDefined()
    const span = component.elem.children[0]
    expect(span.className).toEqual('foo bar test')
  })

  it('can add/remove a single class name', () => {
    const component = createComponent({
      template: `
          <div>
            <span class.visible="{_isVisible}">test</span>
          </div>
        `,
      class: class {
        setVisible (yes) {
          this._isVisible = yes
        }
      }
    })
    component.setVisible(true)
    component.patch()
    expect(component.elem).toBeDefined()
    let span = component.elem.children[0]
    expect(span.className).toEqual('visible')

    component.setVisible(false)
    component.patch()
    expect(component.elem).toBeDefined()
    span = component.elem.children[0]
    expect(span.className).toEqual('')
  })

})
