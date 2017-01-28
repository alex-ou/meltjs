import {Component, registerComponent, clearComponenetRegistry} from 'src/web/component'

describe('ref', () => {
  beforeEach(() => {
    clearComponenetRegistry()
  })

  it('should set ref to the dom element', () => {
    let _isVisible = true
    const component = new Component({
      template: `
          <div>
            <span class="11" if="isVisible()" ref="myspan">test</span>
          </div>
        `,
      isVisible: () => _isVisible
    })
    component.patch()
    expect(component.refs.myspan).toBeDefined()
    expect(component.refs.myspan.innerHTML).toBe('test')
    expect(component.refs.myspan.getAttribute('class')).toBe('11')

    _isVisible = false
    component.patch()
    expect(component.refs.myspan).toBeUndefined()
  })

  it('should set ref to the component itself', () => {
    const childTpl = '<span>child</span>'
    registerComponent('child-comp', {
      template: childTpl
    })

    let _isVisible = true

    const component = new Component({
      template: `
          <div>
            <child-comp if="isVisible()" ref="mycomp">test</child-comp>
          </div>
        `,
      isVisible: () => _isVisible
    })
    component.patch()
    expect(component.refs.mycomp).toBeDefined()
    expect(component.refs.mycomp.template).toEqual(childTpl)

    _isVisible = false
    component.patch()
    expect(component.refs.mycomp).toBeUndefined()
  })

  it('should set refs correctly when using for', () => {
    let count = 10
    const component = new Component({
      template: `
          <div>
            <span each="index in range(count())" ref="{'myspan' + index}">{'span' + index}</span>
          </div>
        `,
      count: () => count
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
