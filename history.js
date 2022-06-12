// Still a work in progress.
import EventEmitter from 'events'

// const transaction = {
//   createdBy: 'abc123',
//   version: 0,
//   operations: [
//     {
//       type: 'set',
//       key: '123abc',
//       value: 'some value',
//     },
//   ],
// }

const getChanges = (transaction) => {
  const changes = {}
  transaction.operations.forEach((operation) => {
    if (
      operation.type === OPERATIONS.CREATE ||
      operation.type === OPERATIONS.SET
    ) {
      changes[operation.key] = operation.value
    }
  })
  return changes
}

const getLastOperationForKey = (transactions, index, key) => {
  for (let i = index; i >= 0; i--) {
    const transaction = transactions[i]
    const operation = transaction.operations.find(
      (operation) => operation.key === key
    )
    if (operation !== null) {
      return operation
    }
  }
  return null
}

const getUndoChanges = (transactions) => {
  const changes = {}
  const transaction = transactions[transactions.length - 1]

  transaction.operations.forEach((operation) => {
    const lastOperation = getLastOperationForKey(transactions, operation.key)
    if (lastOperation !== null) {
      changes[operation.key] = lastOperation.value
    } else {
      changes[operation.key] = null
    }
  })
  return changes
}

const applyChanges = (state, changes) => {
  const newState = {}
  Object.keys(state).forEach((key) => {
    newState[key] = changes[key]
  })
  return newState
}

const OPERATIONS = {
  CREATE: 'create',
  SET: 'set',
}

export class History {
  constructor(transactions) {
    this.transactions = transactions
    this.currentIndex = 0
    this.state = null
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(0)
  }

  get() {
    return this.transactions
  }

  applyChanges(changes) {
    this.state = applyChanges(this.state, changes)
    if (changes !== null) {
      this.emit('changes', changes)
    }
  }

  push(transaction) {
    if (this.currentIndex < this.transactions.length - 1) {
      this.transactions.splice(this.currentIndex + 1)
    } else {
      this.transactions.push(transaction)
    }
    this.currentIndex = this.transactions.length + 1
    const changes = getChanges(transaction)
    this.applyChanges(changes)
  }

  undo() {
    this.currentIndex = Math.max(0, this.currentIndex - 1)
    const changes = getUndoChanges(this.transactions)
    this.applyChanges(changes)
  }

  redo() {
    this.currentIndex = Math.min(
      this.transactions.length - 1,
      this.currentIndex + 1
    )
    const changes = getChanges(this.transactions[this.currentIndex])
    this.applyChanges(changes)
  }

  canUndo() {
    return this.currentIndex > 0
  }

  canRedo() {
    return this.currentIndex < this.transactions.length - 1
  }

  subscribe(event, callback) {
    this.emitter.addListener(event, callback)
  }

  unsubscribe(callback) {
    this.emitter.removeListener(event, callback)
  }

  getSubscriptionCount(event) {
    return this.emitter.listenerCount(event)
  }
}
