import {isUndefined} from './type'
/**
 * Use typed arrays if we can
 */
const FastArray = isUndefined(Uint32Array) ? Array : Uint32Array

/**
 * Bitset
 */
export default class Bitset {
  constructor (sizeInBits) {
    this.bits = new FastArray(Math.ceil(sizeInBits / 32))
  }

  static id (idx) {
    const r = idx % 32
    const p = (idx - r) / 32

    return {r, p}
  }

  setBit (idx) {
    let id = Bitset.id(idx)
    this.bits[id.p] |= (1 << id.r)
  }

  clearBit (idx) {
    let id = Bitset.id(idx)
    this.bits[id.p] &= ~(1 << id.r)
  }

  getBit (idx) {
    let id = Bitset.id(idx)
    return !!(this.bits[id.p] & (1 << id.r))
  }
}

