import {each} from '../../util/index'

export * from './elements'

export function renderCollection (items, itemRenderer) {
  let results = []
  each(items, (v, k) => {
    results.push(itemRenderer(v, k))
  })
  return results
}
