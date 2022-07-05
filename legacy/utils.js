import * as flatObject from './flat-object-2'

export const deepCompare = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const OPERATION = {
  SET: 'set',
}

export const operation = {
  set: (key, value) => ({ type: OPERATION.SET, key, value }),
}

export const filterRemoteOperationsToApply = (
  versions,
  lastUpdatedBy,
  version,
  operations
) => {
  return operations
    .map((operation) => {
      const [op, key] = operation

      let shouldUpdate

      switch (op) {
        case OP_TYPE.SET:
          shouldUpdate = flatObject.shouldSetRemote(
            versions,
            key,
            version,
            lastUpdatedBy
          )
          break
      }

      return shouldUpdate ? operation : null
    })
    .filter((op) => op !== null)
}

export const filterLocalOperationsToApply = (
  versions,
  lastUpdatedBy,
  version,
  operations
) => {
  return operations
    .map((operation) => {
      const [op, key] = operation

      let shouldUpdate

      switch (op) {
        case OP_TYPE.SET:
          shouldUpdate = flatObject.shouldSetLocal(
            versions,
            key,
            version,
            lastUpdatedBy
          )
          break
      }

      return shouldUpdate ? operation : null
    })
    .filter((op) => op !== null)
}

export const filterRemoteChangesToApply = (versions, changes) => {
  const filteredChanges = {}
  Object.keys(changes).forEach((key) => {
    const change = changes[key]
    const { version, lastUpdatedBy } = change
    const shouldUpdate = flatObject.shouldSetRemote(
      versions,
      key,
      version,
      lastUpdatedBy
    )
    if (shouldUpdate) {
      filteredChanges[key] = change
    }
  })
  return Object.keys(filteredChanges).length > 0 ? filteredChanges : null
}

// We will need to split this up between remote and local.
// export const applyOperations = (
//   versions,
//   values,
//   lastUpdatedBy,
//   version,
//   operations
// ) => {
//   const appliedOperations = operations
//     .map((operation) => {
//       const [op, key, ...options] = operation

//       let result = null

//       switch (op) {
//         case OP_TYPE.SET:
//           result = flatObject.setChildByKey(
//             versions,
//             key,
//             options[0],
//             version,
//             lastUpdatedBy
//           )
//           break
//       }

//       return result === null ? null : operation
//     })
//     .filter((result) => result !== null)
//   appliedOperations.forEach((operation) => {
//     const [op, key, ...options] = operation

//     switch (op) {
//       case OP_TYPE.SET: {
//         values[key] = options[0]
//         appliedValues[key] = options[0]
//         break
//       }
//     }
//   })
//   return appliedOperations
// }

// export const applyChanges = (versions, values, changes) => {
//   const appliedChanges = {}
//   Object.keys(changes).forEach((key) => {
//     const change = changes[key]
//     // const { value, version, lastUpdatedBy } = change
//     const result = flatObject.setChildByKey(
//       versions,
//       key,
//       change.version,
//       change.lastUpdatedBy
//     )

//     if (result !== null) {
//       values[key] = change.value
//       appliedChanges[key] = { ...result, value: change.value }
//     }
//   })
//   // if (lwwRegister.shouldUpdate(this.version, this.lastUpdatedBy, version, userId)) {
//   //   this.version = version
//   //   this.lastUpdatedBy = userId
//   // }
//   // if (hasChanged) {
//   //   this.emit(MEMORY_EVENT.APPLY_CHANGES, changes.userId, changes.version, appliedChanges)
//   // }
// }
