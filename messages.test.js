import { createClientMessage, createServerMessage } from './messages.js'

describe('messages', () => {
  it('should create connect client message', () => {
    const operations = [['1234', [1, 'james'], { name: 'node1' }]]
    const message = createClientMessage.connect(0, operations)
    expect(message).toEqual(['connect', 0, operations])
  })
  it('should create patch client message', () => {
    const operations = [['1234', [1, 'james'], { name: 'node1' }]]
    const message = createClientMessage.patch(operations)
    expect(message).toEqual(['patch', operations])
  })
  it('should create patch server message', () => {
    const operations = [['1234', [1, 'james'], { name: 'node1' }]]
    const message = createServerMessage.patch(0, operations)
    expect(message).toEqual(['patch', 0, operations])
  })
})
