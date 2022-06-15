import EventEmitter from 'events'
import * as flatObject from './flat-object.js'
import { where } from './queries.js'
import { valueIsType } from './types.js'

class Memory {
  constructor(serverId, type) {
    this.type = type
    this.serverId = serverId
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(0)
    this.values = flatObject.create({}, serverId)
  }

  where(path, operator, value) {
    return where(this.values, path, operator, value)
  }

  getValue(key) {
    return { key, value: flatObject.getChildByKey(this.values, key) }
  }

  setValue(key, value, userId, version) {
    if (!valueIsType(value, this.type)) {
      return
    }
    const changes = flatObject.setChildByKey(
      this.values,
      key,
      value,
      userId,
      version
    )
    if (changes !== null) {
      this.emitter.emit(key, key, changes)
    }
  }

  subscribe(key, callback) {
    this.emitter.addListener(key, callback)
  }

  unsubscribe(key, callback) {
    this.emitter.removeListener(key, callback)
  }

  getSubscriptionCount(key) {
    return this.emitter.listenerCount(key)
  }
}

export default Memory
