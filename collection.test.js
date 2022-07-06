import * as collection from './collection.js'

describe('collection', () => {
  it('should create', () => {
    const versions = collection.create()
    expect(versions).toMatchObject({})
  })
  it('should getChild', () => {
    const versions = {}
    versions['id'] = [1, 'james']
    expect(collection.getChild(versions, 'id')).toMatchObject([1, 'james'])
  })
  it('should setChild', () => {
    const versions = {}
    collection.setChild(versions, 'id', 1, 'james')
    expect(versions['id']).toMatchObject([1, 'james'])
  })
  it('should shouldSetChild', () => {
    const versions = {}
    collection.setChild(versions, 'id', 1, 'james')
    expect(collection.shouldSetChild(versions, 'id', 2, 'james')).toBe(true)
    expect(collection.shouldSetChild(versions, 'id', 2, 'steve')).toBe(true)
    expect(collection.shouldSetChild(versions, 'id', 1, 'steve')).toBe(true)
    expect(collection.shouldSetChild(versions, 'id', 1, 'james')).toBe(false)
    expect(collection.shouldSetChild(versions, 'id', 1, 'bob')).toBe(false)
  })
})
