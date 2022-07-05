import EventEmitter from 'events'
import * as shelf from './shelf.js'
import * as type from './type.js'
import { createDiff } from './utils.js'
import { valueIsType } from './type.js'

const MEMORY_EVENT = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
}

class Memory extends EventEmitter {
  constructor(typeDefinition) {
    super()
    this.setMaxListeners(0)
    this.values = {}
    this.versions = {}
    this.type = type.create(typeDefinition)
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
    this.emit(MEMORY_EVENT.CREATE, sequence, userId, value)
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
      this.emit(MEMORY_EVENT.UPDATE, sequence, userId, filteredDiff)
    }
  }

  delete(key, sequence, userId) {
    delete this.values[key]
    delete this.versions[key]
    this.emit(MEMORY_EVENT.DELETE, sequence, userId)
  }
}

export default Memory
