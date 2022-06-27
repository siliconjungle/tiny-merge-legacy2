import EventEmitter from 'events'
import * as flatObject from './flat-object.js'
import { OPERATION } from './history.js'
import { where } from './queries.js'
import { valueIsType } from './types.js'

class Memory extends EventEmitter {
  constructor(serverId, type) {
    super()
    this.setMaxListeners(0)
    this.type = type
    this.serverId = serverId
    this.values = flatObject.create({}, serverId)
  }

  where(path, operator, value) {
    return where(this.values, path, operator, value)
  }

  hasChildChanged(version, userId, key) {
    return flatObject.hasChildChanged(this.values, version, userId, key)
  }

  getChanges(version, userId) {
    return flatObject.getChangesSinceVersion(this.values, version, userId)
  }

  getChangesWhere(version, userId, path, operator, value) {
    return where(this.getChanges(version, userId), path, operator, value)
  }

  getValue(key) {
    return { key, value: flatObject.getChildByKey(this.values, key) }
  }

  getAll() {
    return this.values
  }

  // There should be a create value and delete value method as well.
  // Each time a value is created, or deleted, it should be stored in a cache related to that key.
  setValue(key, value, version, userId) {
    if (!valueIsType(value, this.type)) {
      return
    }
    const changes = flatObject.setChildByKey(
      this.values,
      key,
      value,
      version,
      userId
    )
    if (changes !== null) {
      this.emit(key, key, changes)
    }
  }

  // Once add and delete operations are added, then you send the full object on creation
  // and delta on replace, and delete does not need any object data.
  applyTransaction(transaction, version, userId) {
    transaction.operations.forEach((operation) => {
      if (operation.type === OPERATION.SET) {
        this.setValue(operation.key, operation.value, version, userId)
      }
    })
  }
}

export default Memory
