import * as tiny from './tiny.js'

describe('tiny', () => {
  it('should create', () => {
    const version = tiny.create(1, 'james')
    expect(version).toEqual([1, 'james'])
  })

  it('should shouldSet', () => {
    const version = tiny.create(1, 'james')
    expect(tiny.shouldSet(version, 2, 'james')).toBe(true)
    expect(tiny.shouldSet(version, 2, 'steve')).toBe(true)
    expect(tiny.shouldSet(version, 1, 'steve')).toBe(true)
    expect(tiny.shouldSet(version, 1, 'james')).toBe(false)
  })
})
