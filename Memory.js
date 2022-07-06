import EventEmitter from 'events'
import * as collection from './collection.js'
import * as latestChanges from './latest-changes.js'
import { createOperation } from './messages.js'

export const MEMORY_EVENT = {
  APPLY_OPERATIONS_LOCAL: 'apply-operations-local',
  APPLY_OPERATIONS_REMOTE: 'apply-operations-remote',
}

class Memory extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(0)
    this.values = {}
    this.versions = collection.create()
    this.latestChanges = latestChanges.create()
    this.serverVersion = 0
  }

  getChangesSince(serverVersion) {
    const changes = latestChanges.getChangesSinceVersion(
      this.latestChanges,
      serverVersion
    )

    return changes.map((id) => {
      const version = collection.getChild(this.versions, id)
      const value = this.values[id]

      return createOperation(id, version, value)
    })
  }

  filterOperations(operations) {
    return operations
      .filter((operation) => {
        const [id, [sequence, userId]] = operation
        return collection.shouldSetChild(this.versions, id, sequence, userId)
      })
      .map((operation) => {
        const [id, [sequence, userId], value] = operation
        collection.setChild(this.versions, id, sequence, userId)
        latestChanges.setChild(this.latestChanges, id, this.serverVersion)
        this.values[id] = value
        return operation
      })
  }

  applyOperationsLocal(operations) {
    const filteredOperations = this.filterOperations(operations)
    if (filteredOperations.length > 0) {
      this.emit(MEMORY_EVENT.APPLY_OPERATIONS_LOCAL, filteredOperations)
    }
  }

  applyOperationsRemote(operations) {
    const filteredOperations = this.filterOperations(operations)
    if (filteredOperations.length > 0) {
      this.serverVersion++
      this.emit(MEMORY_EVENT.APPLY_OPERATIONS_REMOTE, filteredOperations)
    }
  }
}

export default Memory
