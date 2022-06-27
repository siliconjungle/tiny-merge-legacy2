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

  hasDocumentChanged(version, userId, key) {
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

  // If we separate the values out of the last writer wins registers then we don't need to split them up like this.
  getAllValues() {
    return Object.keys(this.values).map((key) => {
      return this.values[key].value
    })
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

  onConnect(serverVersion, userId, data) {
    if (data === undefined) {
      // In the future you should be able to get all values for
      // a specific query or just the value of specific elements.
      // The connection logic should lump it all together.
      return [serverVersion, this.getAllValues()]
    } else {
      const [version, transaction] = data
      this.applyTransaction(transaction, version + 1, userId)
      return [
        Math.max(serverVersion, version + 1),
        this.getChanges(version, userId),
      ]
    }
  }
}

export default Memory
