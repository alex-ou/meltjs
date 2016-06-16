import Bitset from 'src/util/bitset'

describe('bitset', () => {
  it('can set bitset', () => {
    const bitset = new Bitset(8)
    bitset.setBit(3)

    expect(bitset.getBit(3)).toBe(true)
    expect(bitset.getBit(4)).toBe(false)

    bitset.clearBit(3)
    expect(bitset.getBit(3)).toBe(false)

    bitset.setBit(8)
    expect(bitset.getBit(8)).toBe(true)
  })
})

