import EventEmitter from 'events'
import * as shelf from './shelf.js'
import * as type from './type.js'
import { createDiff, deepPatch, OPERATION, deepCopy } from './utils.js'
import { valueIsType } from './type.js'

export const MEMORY_EVENT = {
  APPLY_LOCAL: 'apply-local',
  APPLY_REMOTE: 'apply-remote',
}

class Memory extends EventEmitter {
  constructor(typeDefinition) {
    super()
    this.setMaxListeners(0)
    this.values = {}
    this.versions = {}
    this.type = type.create(typeDefinition)
  }

  getAllVersions() {
    return deepCopy(this.versions)
  }

  getVersionsByKey(key) {
    return deepCopy(this.versions[key])
  }

  getDiffByKey(key, value) {
    return createDiff(this.type.definition, this.values[key], value)
  }

  create(key, value, sequence, userId) {
    if (!valueIsType(value, this.type.definition)) {
      return
    }

    this.values[key] = value
    this.versions[key] = shelf.create(value, sequence, userId)
  }

  update(key, diff, sequence, userId) {
    if (!valueIsType(value, this.type.definition)) {
      return
    }

    if (this.values[key] === undefined) {
      return
    }

    const filteredDiff = shelf.filterDiffToApply(
      this.versions[key],
      sequence,
      userId,
      diff
    )

    if (filteredDiff.length > 0) {
      shelf.setVersionsFromDiff(
        this.versions[key],
        filteredDiff,
        sequence,
        userId
      )

      this.values[key] = deepPatch(this.values[key], filteredDiff)
    }
  }

  applyChanges(changes) {}

  applyOperations(ops, sequence, userId, event) {
    const filteredOps = ops.filter((op) => {
      const [type, key, ...options] = op
      switch (type) {
        // Bake the version numbers into each operation
        // It takes up more space, but then you don't need a get changes method.
        case OPERATION.CREATE: {
          return shelf.shouldCreate(this.versions[key], sequence, userId)
        }
        case OPERATION.UPDATE: {
          return (
            shelf.filterDiffToApply(
              this.versions[key],
              sequence,
              userId,
              options[0]
            ).length > 0
          )
        }
        default: {
          return false
        }
      }
    })

    if (filteredOps.length > 0) {
      this.emit(event, ops, sequence, userId)
    }
  }

  applyOperationsLocal(ops, sequence, userId) {
    this.applyOperations(ops, sequence, userId, MEMORY_EVENT.APPLY_LOCAL)
  }

  applyOperationsRemote(ops, sequence, userId) {
    this.applyOperations(ops, sequence, userId, MEMORY_EVENT.APPLY_REMOTE)
  }
}

export default Memory
