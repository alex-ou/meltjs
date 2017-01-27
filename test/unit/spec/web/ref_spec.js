import {Component} from 'src/web/component'

describe('ref', () => {
  it('should update refs correctly', () => {
    let _isVisible = true
    const component = new Component({
      template: `
          <div>
            <span key="11" if="isVisible()" ref="myspan">test</span>
          </div>
        `,
      isVisible: () => _isVisible
    })
    component.patch({component})
    expect(component.refs.myspan).toBeDefined()
    expect(component.refs.myspan.innerHTML).toBe('test')

    _isVisible = false
    component.patch({component})
    expect(component.refs.myspan).toBeUndefined()
  })
})
