import EventEmitter from 'events'
import * as shelf from './shelf.js'
import * as type from './type.js'
import { createDiff, deepPatch } from './utils.js'
import { valueIsType } from './type.js'

const MEMORY_EVENT = {
  CREATE_LOCAL: 'create-local',
  UPDATE_LOCAL: 'update-local',
  CREATE_REMOTE: 'create-remote',
  UPDATE_REMOTE: 'update-remote',
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

  create(key, value, sequence, userId, event) {
    if (!valueIsType(value, this.type.definition)) {
      return
    }

    this.values[key] = value
    this.versions[key] = shelf.create(value, sequence, userId)
    this.emit(event, sequence, userId, value)
  }

  createLocal(key, value, sequence, userId) {
    this.create(key, value, sequence, userId, MEMORY_EVENT.CREATE_LOCAL)
  }

  createRemote(key, value, sequence, userId) {
    this.create(key, value, sequence, userId, MEMORY_EVENT.CREATE_REMOTE)
  }

  update(key, diff, sequence, userId, event) {
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

      this.emit(event, sequence, userId, filteredDiff)
    }
  }

  updateLocal(key, diff, sequence, userId) {
    this.update(key, diff, sequence, userId, MEMORY_EVENT.UPDATE_LOCAL)
  }

  updateRemote(key, diff, sequence, userId) {
    this.update(key, diff, sequence, userId, MEMORY_EVENT.UPDATE_REMOTE)
  }
}

export default Memory
