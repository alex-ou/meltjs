import {createComponent} from 'src/web/component'
import {clearRegistry, registerDirective} from 'src/web/component_registry'

describe('Custom directive', () => {
  beforeEach(() => {
    clearRegistry()
  })

  it('can use short-hand syntax to register', () => {
    registerDirective('myHighlight', class {
      attached (binding, vnode) {
        vnode.elem.style.color = 'red'
      }
      detached (vnode) {
        vnode.elem.style.removeProperty('color')
      }
    })
    const component = createComponent({
      template: `
          <div>
            <span if="_isHighlighted" my-highlight>foo</span>
            <span if="!_isHighlighted">bar</span>
          </div>
        `,
      class: class {
        highlight (yes) {
          this._isHighlighted = yes
        }
      }
    })
    component.highlight(true)
    component.patch()
    expect(component.elem).toBeDefined()
    let span = component.elem.children[0]
    expect(span.style.color).toBe('red')

    component.highlight(false)
    component.patch()
    span = component.elem.children[0]
    expect(span.style.color).toBe('')
  })
})
