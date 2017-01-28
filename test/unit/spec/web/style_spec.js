import {Component, clearComponenetRegistry} from 'src/web/component'
import Melt from 'src/index'

describe('style', () => {
  beforeEach(() => {
    clearComponenetRegistry()
  })

  it('should set styles of the dom element', () => {
    const app = Melt({
      el: document.body,
      template: `
          <div>
            <span style="{{'height': '20px', 'font-size': '40px'}}">test</span>
          </div>
        `,
      model: {},
      update: {
      }
    })

    //expect(app.component.elem).toBeDefined()
    //expect(app.component.elem.style.height).toEqual('red')
  })
})
