import {isUndefined} from '../util/index'
import Bitset from '../util/bitset'

const CREATE = 0
const UPDATE = 1
const MOVE = 2
const REMOVE = 3

/**
 * Compare two arrays of virtual nodes and emit the actions to transform the left into the right.
 * CREATE - Receives (type = CREATE, prev = null, next = newItem, pos = positionToCreate)
 * UPDATE - Receives (type = UPDATE, prev = oldItem, next = newItem)
 * MOVE - Receives (type = MOVE, prev = oldItem, next = newItem, pos = newPosition)
 * REMOVE - Receives (type = REMOVE, prev = oldItem)
 */
function diff (oldChildren, newChildren, effect, keyGetter) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newEndIdx = newChildren.length - 1
  let oldStartNode = oldChildren[oldStartIdx]
  let newStartNode = newChildren[newStartIdx]

  // List head is the same
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx && equal(oldStartNode, newStartNode)) {
    effect(UPDATE, oldStartNode, newStartNode, newStartIdx)
    oldStartNode = oldChildren[++oldStartIdx]
    newStartNode = newChildren[++newStartIdx]
  }

  if (newStartIdx > newEndIdx && oldStartIdx > oldEndIdx) {
    return
  }

  let oldEndNode = oldChildren[oldEndIdx]
  let newEndNode = newChildren[newEndIdx]
  let movedFromFront = 0

  // Reversed
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx && equal(oldStartNode, newEndNode)) {
    effect(MOVE, oldStartNode, newEndNode, (oldEndIdx - movedFromFront) + 1)
    oldStartNode = oldChildren[++oldStartIdx]
    newEndNode = newChildren[--newEndIdx]
    ++movedFromFront
  }

  // Reversed the other way (in case of e.g. reverse and append)
  while (oldEndIdx >= oldStartIdx && newStartIdx <= newEndIdx && equal(newStartNode, oldEndNode)) {
    effect(MOVE, oldEndNode, newStartNode, newStartIdx)
    oldEndNode = oldChildren[--oldEndIdx]
    newStartNode = newChildren[++newStartIdx]
    --movedFromFront
  }

  // List tail is the same
  while (oldEndIdx >= oldStartIdx && newEndIdx >= newStartIdx && equal(oldEndNode, newEndNode)) {
    effect(UPDATE, oldEndNode, newEndNode, newEndIdx)
    oldEndNode = oldChildren[--oldEndIdx]
    newEndNode = newChildren[--newEndIdx]
  }

  if (oldStartIdx > oldEndIdx) {
    while (newStartIdx <= newEndIdx) {
      effect(CREATE, null, newStartNode, newStartIdx)
      newStartNode = newChildren[++newStartIdx]
    }

    return
  }

  if (newStartIdx > newEndIdx) {
    while (oldStartIdx <= oldEndIdx) {
      effect(REMOVE, oldStartNode)
      oldStartNode = oldChildren[++oldStartIdx]
    }

    return
  }

  let created = 0
  let pivotDest = null
  let pivotIdx = oldStartIdx - movedFromFront
  const keepBase = oldStartIdx
  const keep = new Bitset(oldEndIdx - oldStartIdx)

  const prevMap = keyMap(oldChildren, oldStartIdx, oldEndIdx + 1, keyGetter)

  for (; newStartIdx <= newEndIdx; newStartNode = newChildren[++newStartIdx]) {
    const oldIdx = prevMap[keyGetter(newStartNode)]

    if (isUndefined(oldIdx)) {
      effect(CREATE, null, newStartNode, pivotIdx++)
      ++created
    } else if (oldStartIdx !== oldIdx) {
      keep.setBit(oldIdx - keepBase)
      effect(MOVE, oldChildren[oldIdx], newStartNode, pivotIdx++)
    } else {
      pivotDest = newStartIdx
    }
  }

  if (pivotDest !== null) {
    keep.setBit(0)
    effect(MOVE, oldChildren[oldStartIdx], newChildren[pivotDest], pivotDest)
  }

  // If there are no creations, then you have to
  // remove exactly max(prevLen - nextLen, 0) elements in this
  // diff. You have to remove one more for each element
  // that was created. This means once we have
  // removed that many, we can stop.
  const necessaryRemovals = (oldChildren.length - newChildren.length) + created
  for (let removals = 0; removals < necessaryRemovals; oldStartNode = oldChildren[++oldStartIdx]) {
    if (!keep.getBit(oldStartIdx - keepBase)) {
      effect(REMOVE, oldStartNode)
      ++removals
    }
  }

  function equal (a, b) {
    return keyGetter(a) === keyGetter(b)
  }
}

function keyMap (items, start, end, key) {
  const map = {}

  for (let i = start; i < end; ++i) {
    map[key(items[i])] = i
  }

  return map
}

export default diff
export {
  CREATE,
  UPDATE,
  MOVE,
  REMOVE
}
