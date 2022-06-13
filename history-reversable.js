import EventEmitter from 'events'
import { deepCopy } from './utils.js'

// const transaction = [
//   {
//     type: 'set',
//     key: '123abc',
//     value: 'some value',
//   },
// ],

export const OPERATION = {
  CREATE: 'create',
  SET: 'set',
  DELETE: 'delete',
}

export const operation = {
  create: (key, value) => ({ type: OPERATION.CREATE, key, value }),
  set: (key, value) => ({ type: OPERATION.SET, key, value }),
  delete: (key) => ({ type: OPERATION.DELETE, key }),
}

const getInverseOperation = (state, operation) => {
  switch (operation.type) {
    case OPERATION.CREATE:
      return {
        type: OPERATION.DELETE,
        key: operation.key,
      }
    case OPERATION.SET:
      return {
        type: OPERATION.SET,
        key: operation.key,
        value: state[operation.key],
      }
    case OPERATION.DELETE:
      return {
        type: OPERATION.CREATE,
        key: operation.key,
        value: state[operation.key],
      }
    default:
      throw new Error(`Unknown operation type: ${operation.type}`)
  }
}

const applyOperationToState = (state, operation) => {
  const deepState = deepCopy(state)

  switch (operation.type) {
    case OPERATION.CREATE:
      deepState[operation.key] = operation.value
    case OPERATION.SET:
      deepState[operation.key] = operation.value
    case OPERATION.DELETE:
      delete state[operation.key]
  }
  return deepState
}

const getUndoTransaction = (state, transaction) => {
  const undoTransaction = transaction.map((operation) =>
    getInverseOperation(state, operation)
  )

  return {
    undo: undoTransaction,
    redo: transaction,
  }
}

class History {
  constructor() {
    this.stack = []
    this.currentIndex = 0
    this.state = {}
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(0)
  }

  get() {
    return this.stack
  }

  applyChanges(transaction) {
    transaction.forEach((operation) => {
      this.state = applyOperationToState(this.state, operation)
    })

    this.emitter.emit('changes', transaction)
  }

  push(transaction) {
    const reversableTransaction = getUndoTransaction(this.state, transaction)
    if (this.currentIndex < this.stack.length - 1) {
      this.stack.splice(
        this.currentIndex + 1,
        this.stack.length - this.currentIndex - 1,
        reversableTransaction
      )
    } else {
      this.stack.push(reversableTransaction)
    }
    this.currentIndex++
    this.applyChanges(transaction)
  }

  undo() {
    this.currentIndex = Math.max(0, this.currentIndex - 1)
    console.log(this.stack[this.currentIndex])
    this.applyChanges(this.stack[this.currentIndex].undo)
  }

  redo() {
    this.currentIndex = Math.min(this.stack.length - 1, this.currentIndex + 1)
    this.applyChanges(this.stack[this.currentIndex].redo)
  }

  canUndo() {
    return this.currentIndex > 0
  }

  canRedo() {
    return this.currentIndex < this.stack.length - 1
  }

  subscribe(event, callback) {
    this.emitter.addListener(event, callback)
  }

  unsubscribe(event, callback) {
    this.emitter.removeListener(event, callback)
  }

  getSubscriptionCount(event) {
    return this.emitter.listenerCount(event)
  }
}

export default History
