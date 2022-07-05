import EventEmitter from 'events'
import * as tiny from './tiny.js'
import * as collection from './collection.js'
import * as type from './type.js'
import { createDiff } from './utils.js'
import {
  //   applyChanges,
  //   applyOperations,
  filterLocalOperationsToApply,
  //   filterRemoteOperationsToApply,
  //   filterRemoteChangesToApply,
} from './utils.js'

class Memory extends EventEmitter {
  constructor(typeDefinition) {
    super()
    this.setMaxListeners(0)
    this.collection = collection.create()
    this.values = {}
    this.tiny = tiny.create(0, null)
    this.type = type.create(typeDefinition)
  }

  getDiffByKey(key, value) {
    if (!valueIsType(value, this.type.definition)) {
      throw new Error(`Value is not of type: ${this.type.definition}`)
    }

    return createDiff(this.type.definition, this.values[key], value)
  }

  applyLocalOperations(lastUpdatedBy, operations) {
    const operationsToApply = filterLocalOperationsToApply(
      this.versions,
      lastUpdatedBy,
      this.version + 1,
      operations
    )

    // if (operationsToApply.length > 0) {
    //   collection.applyOperations(this.versions, operationsToApply)
    //   applyOperations(this.values, operationsToApply)
    //   this.emit(
    //     MEMORY_EVENT.APPLY_OPERATIONS_LOCAL,
    //     lastUpdatedBy,
    //     this.version + 1,
    //     operationsToApply
    //   )
    // }
  }

  // applyRemoteChanges(changes) {
  //   const changesToApply = filterRemoteChangesToApply(this.versions, changes)

  //   if (changesToApply !== null) {
  //     collection.applyChanges(this.versions, changesToApply)
  //     applyChanges(this.values, changesToApply)
  //     if (
  //       tiny.shouldSetRemote(
  //         this.version,
  //         this.lastUpdatedBy,
  //         version,
  //         lastUpdatedBy
  //       )
  //     ) {
  //       this.version = version
  //       this.lastUpdatedBy = lastUpdatedBy
  //     }
  //     this.emit(
  //       MEMORY_EVENT.APPLY_CHANGES,
  //       this.lastUpdatedBy,
  //       this.version,
  //       changesToApply
  //     )
  //   }
  // }

  // applyLocalOperations(lastUpdatedBy, operations) {
  //   const operationsToApply = filterLocalOperationsToApply(
  //     this.versions,
  //     lastUpdatedBy,
  //     this.version + 1,
  //     operations
  //   )

  //   if (operationsToApply.length > 0) {
  //     collection.applyOperations(this.versions, operationsToApply)
  //     applyOperations(this.values, operationsToApply)
  //     this.emit(
  //       MEMORY_EVENT.APPLY_OPERATIONS_LOCAL,
  //       lastUpdatedBy,
  //       this.version + 1,
  //       operationsToApply
  //     )
  //   }
  // }

  // applyRemoteOperations(lastUpdatedBy, version, operations) {
  //   const operationsToApply = filterRemoteOperationsToApply(
  //     this.versions,
  //     lastUpdatedBy,
  //     version,
  //     operations
  //   )

  //   if (operationsToApply.length > 0) {
  //     applyOperationsToValues(this.values, appliedOperations)
  //     collection.applyOperations(this.versions, operationsToApply)
  //     applyOperations(this.values, operationsToApply)
  //     if (
  //       tiny.shouldSetRemote(
  //         this.version,
  //         this.lastUpdatedBy,
  //         version,
  //         lastUpdatedBy
  //       )
  //     ) {
  //       this.version = version
  //       this.lastUpdatedBy = lastUpdatedBy
  //     }
  //     this.emit(
  //       MEMORY_EVENT.APPLY_OPERATIONS_REMOTE,
  //       lastUpdatedBy,
  //       version,
  //       operationsToApply
  //     )
  //   }
  // }
}

export default Memory
