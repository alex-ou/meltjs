import {createComponent} from 'src/web/component'

describe('Directive', () => {
  describe('If', () => {
    it('should render elements based on the condition', () => {
      const component = createComponent({
        template: `
          <div>
            <span if="isVisible()"></span>
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
      let elem = component.patch()
      expect(elem.children.length).toBe(1)
      expect(elem.children[0].tagName).toBe('SPAN')

      component.setVisible(false)
      elem = component.patch()
      expect(elem.children[0].tagName).toBe('NOSCRIPT')

      component.setVisible(true)
      elem = component.patch()
      expect(elem.children.length).toBe(1)
      expect(elem.children[0].tagName).toBe('SPAN')
    })
  })

  describe('Each', () => {
    it('should render elements when providing array', () => {
      const component = createComponent({
        template: `
          <div>
            <span each="item in items">{'item' + item}</span>
          </div>
        `,
        class: function () {
          this.items = [1, 2]
        }
      })
      let elem = component.patch()
      expect(elem.children.length).toBe(2)
      expect(elem.children[0].tagName).toBe('SPAN')
      expect(elem.children[0].textContent).toBe('item1')

      component.items = [3, 4, 5]
      component.patch()
      expect(elem.children.length).toBe(3)
      expect(elem.children[0].tagName).toBe('SPAN')
      expect(elem.children[0].textContent).toBe('item3')
      expect(elem.children[1].textContent).toBe('item4')
      expect(elem.children[2].textContent).toBe('item5')

      component.items = []
      component.patch()
      expect(elem.children.length).toBe(0)
    })

    it('should render elements when providing array', () => {
      const component = createComponent({
        template: `
          <div>
            <span each="(item, index) in items">{item + index}</span>
          </div>
        `,
        class: function () {
          this.items = ['foo', 'bar']
        }
      })
      let elem = component.patch()
      expect(elem.children.length).toBe(2)
      expect(elem.children[0].tagName).toBe('SPAN')
      expect(elem.children[0].textContent).toBe('foo0')
      expect(elem.children[1].textContent).toBe('bar1')
    })

    it('should render elements with the value when providing object', () => {
      const component = createComponent({
        template: `
          <div>
            <span each="value in items">{value}</span>
          </div>
        `,
        class: function () {
          this.items = {
            foo: '11',
            bar: '22'
          }
        }
      })
      let elem = component.patch()
      expect(elem.children.length).toBe(2)
      expect(elem.children[0].tagName).toBe('SPAN')
      expect(elem.children[0].textContent).toBe('11')
      expect(elem.children[1].textContent).toBe('22')
    })

    it('should render elements with the key and the value when providing object', () => {
      const component = createComponent({
        template: `
          <div>
            <span each="(value, key) in items">{value + key}</span>
          </div>
        `,
        class: function () {
          this.items = {
            foo: '11',
            bar: '22'
          }
        }
      })
      let elem = component.patch()
      expect(elem.children.length).toBe(2)
      expect(elem.children[0].tagName).toBe('SPAN')
      expect(elem.children[0].textContent).toBe('11foo')
      expect(elem.children[1].textContent).toBe('22bar')
    })
  })

  it('should render elements correctly when using both each and if', () => {
    const component = createComponent({
      template: `
          <div>
            <span if="{isVisible}" each="(value, key) in items">{value + key}</span>
          </div>
        `,
      class: function () {
        this.items = {
          foo: '11',
          bar: '22'
        }
        this.isVisible = true
      }
    })
    let elem = component.patch()
    expect(elem.children.length).toBe(2)
    expect(elem.children[0].tagName).toBe('SPAN')
    expect(elem.children[0].textContent).toBe('11foo')
    expect(elem.children[1].textContent).toBe('22bar')

    component.isVisible = false
    elem = component.patch()
    expect(elem.children.length).toBe(1)
    expect(elem.children[0].tagName).toBe('NOSCRIPT')
  })
})
