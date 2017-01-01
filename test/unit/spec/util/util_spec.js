import {isObject, isArray, getValues, getKeys, each, extend, range} from 'src/util/index'

describe('util', () => {
  it('check objects correctly', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(function () {})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject('str')).toBe(false)
    expect(isObject(String('str'))).toBe(false)
  })

  it('can check array', () => {
    expect(isArray([])).toBe(true)
    expect(isArray(1)).toBe(false)
    expect(isArray(null)).toBe(false)
    let obj = {}
    obj[0] = 1
    expect(isArray(obj)).toBe(false)
  })

  it('gets keys from the objects', () => {
    function Test () {
      this.a = 1
      this.b = 2
    }
    Test.prototype.foo = 'foo'

    let obj = new Test()
    expect(getKeys(obj)).toEqual(['a', 'b'])

    obj = {}
    expect(getKeys(obj)).toEqual([])

    obj = function () { }
    obj.aa = 1
    expect(getKeys(obj)).toEqual(['aa'])

    let iterable = [3, 5]
    iterable.foo = 'hello'
    expect(getKeys(iterable)).toEqual(['0', '1', 'foo'])
  })

  it('gets values from the objects', () => {
    let obj = {a: 1, b: 2}
    expect(getValues(obj)).toEqual([1, 2])

    obj = {}
    expect(getValues(obj)).toEqual([])

    obj = function () { }
    obj.aa = 1
    expect(getValues(obj)).toEqual([1])
  })

  it('iterate array correctly', () => {
    var indexArr = []
    var values = []
    each([2, 3, 4], (v, i) => {
      indexArr.push(i)
      values.push(v)
    })
    expect(indexArr).toEqual([0, 1, 2])
    expect(values).toEqual([2, 3, 4])
  })

  it('iterate object correctly', () => {
    var keys = []
    var values = []
    each({a: 1, b: 2, c: 3}, (v, k) => {
      keys.push(k)
      values.push(v)
    })
    expect(keys).toEqual(['a', 'b', 'c'])
    expect(values).toEqual([1, 2, 3])
  })

  it('can extend data from other objects', () => {
    expect(extend({}, {a: 1, b: undefined})).toEqual({a: 1})
    expect(extend({}, {a: 1, b: undefined}, {c: 1})).toEqual({a: 1, c: 1})
  })

  it('can generate the range correctly', () => {
    expect(range(4)).toEqual([0, 1, 2, 3])
    expect(range(3, 6)).toEqual([3, 4, 5])
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    expect(range(10, 0, -1)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(range(8, 2, -2)).toEqual([8, 6, 4])
    expect(range(8, 2)).toEqual([])
    expect(range(8, 2, 2)).toEqual([])
    expect(range(1, 5, -1)).toEqual([])
    expect(range(1, 5, -2)).toEqual([])
  })
})

