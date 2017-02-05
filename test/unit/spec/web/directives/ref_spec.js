import {createComponent} from 'src/web/component'
import {registerComponent, clearRegistry} from 'src/web/component_registry'

describe('ref', () => {
  beforeEach(() => {
    clearRegistry()
  })

  it('should set ref to the dom element', () => {
    const component = createComponent({
      template: `
          <div>
            <span class="11" if="isVisible()" ref="myspan">test</span>
          </div>
        `,
      class: class {
        isVisible () {
          return this._isVisible
        }
        setVisible (yes) {
          this._isVisible = yes
        }
      }
    })
    component.setVisible(true)
    component.patch()
    expect(component.refs.myspan).toBeDefined()
    expect(component.refs.myspan.innerHTML).toBe('test')
    expect(component.refs.myspan.getAttribute('class')).toBe('11')

    component.setVisible(false)
    component.patch()
    expect(component.refs.myspan).toBeUndefined()
  })

  it('should set ref to the component itself', () => {
    registerComponent('child-comp', {
      template: '<span>child</span>',
      class: function () {
        this.uniqueId = 10
      }
    })

    const component = createComponent({
      template: `
          <div>
            <child-comp if="isVisible()" ref="mycomp">test</child-comp>
          </div>
        `,
      class: class {
        isVisible () {
          return this._isVisible
        }
        setVisible (yes) {
          this._isVisible = yes
        }
      }
    })
    component.setVisible(true)
    component.patch()
    expect(component.refs.mycomp).toBeDefined()
    expect(component.refs.mycomp.uniqueId).toBe(10)

    component.setVisible(false)
    component.patch()
    expect(component.refs.mycomp).toBeUndefined()
  })

  it('should set refs correctly when using for', () => {
    let count = 10
    const component = createComponent({
      template: `
          <div>
            <span each="index in range(count())" ref="{'myspan' + index}">{'span' + index}</span>
          </div>
        `,
      class: function () {
        this.count = function () {
          return count
        }
      }
    })
    component.patch()
    for (let i = 0; i < count; i++) {
      expect(component.refs['myspan' + i]).toBeDefined()
    }
    expect(component.refs.myspan10).toBeUndefined()

    count = 5
    component.patch()
    for (let i = 0; i < count; i++) {
      expect(component.refs['myspan' + i]).toBeDefined()
    }
    for (let i = count; i < 10; i++) {
      expect(component.refs['myspan' + i]).toBeUndefined()
    }
  })
})
