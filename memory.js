import EventEmitter from 'events'
import * as flatObject from './flat-object.js'
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

  getChanges(version, serverId) {
    return flatObject.getChangesSinceVersion(this.values, version, serverId)
  }

  getValue(key) {
    return { key, value: flatObject.getChildByKey(this.values, key) }
  }

  setValue(key, value, version, serverId) {
    if (!valueIsType(value, this.type)) {
      return
    }
    const changes = flatObject.setChildByKey(
      this.values,
      key,
      value,
      version,
      serverId
    )
    if (changes !== null) {
      this.emit(key, key, changes)
    }
  }
}

export default Memory
