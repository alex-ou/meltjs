import {isObject, isArray, getValues, getKeys, each} from 'src/util/index'

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
    let obj = {a: 1, b: 2}
    expect(getKeys(obj)).toEqual(['a', 'b'])

    obj = {}
    expect(getKeys(obj)).toEqual([])

    obj = function () { }
    obj.aa = 1
    expect(getKeys(obj)).toEqual(['aa'])
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
})

