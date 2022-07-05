import {
  getValueAtPath,
  setValueAtPath,
  // createTinyMappingFromTypeDef,
} from './types'
// import * as collection from './collection'

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
  set: (key, diff) => ({ type: OPERATION.SET, key, diff }),
}

// const diff = [
//   { path: [], value: {} },
//   { path: ['position'], value: {} },
//   { path: ['position', 'x'], value: 5 },
//   { path: ['position', 'y'], value: 6 },
//   { path: ['size'], value: {} },
//   { path: ['size', 'width'], value: 7 },
//   { path: ['size', 'height'], value: 8 },
// ]
// export const filterRemoteDiffToApply = (
//   collection,
//   lastUpdatedBy,
//   version,
//   diff,
// ) => {
//   const filteredDiff = diff.filter(diffOp => {

//   })
//   return filteredDiff
// }

// export const filterRemoteOperationsToApply = (
//   collection,
//   lastUpdatedBy,
//   version,
//   operations
// ) => {
//   return operations
//     .map((operation) => {
//       const { type, key } = operation

//       let shouldUpdate

//       switch (type) {
//         case OP_TYPE.SET:
//           // const diffGroups = groupDiffByVersions(c)
//           // shouldUpdate = collection.shouldSetRemote(
//           //   versions,
//           //   key,
//           //   version,
//           //   lastUpdatedBy
//           // )
//           break
//       }

//       return shouldUpdate ? operation : null
//     })
//     .filter((op) => op !== null)
// }

// export const filterLocalOperationsToApply = (
//   versions,
//   lastUpdatedBy,
//   version,
//   operations
// ) => {
//   return operations
//     .map((operation) => {
//       const { type, key } = operation

//       let shouldUpdate

//       switch (type) {
//         case OP_TYPE.SET:
//           shouldUpdate = collection.shouldSetLocal(
//             versions,
//             key,
//             version,
//             lastUpdatedBy
//           )
//           break
//       }

//       return shouldUpdate ? operation : null
//     })
//     .filter((op) => op !== null)
// }

// export const filterRemoteChangesToApply = (versions, changes) => {
//   const filteredChanges = Object.keys(changes).reduce(
//     (filteredChanges, key) => {
//       const change = changes[key]
//       const { version, lastUpdatedBy } = change
//       const shouldUpdate = collection.shouldSetRemote(
//         versions,
//         key,
//         version,
//         lastUpdatedBy
//       )
//       if (shouldUpdate) {
//         filteredChanges[key] = change
//       }
//       return filteredChanges
//     },
//     {}
//   )

//   return Object.keys(filteredChanges).length > 0 ? filteredChanges : null
// }

// export const applyOperations = (value, operations) => {
//   operations.forEach((operation) => {
//     const { type, key } = operation
//     switch (type) {
//       case OP_TYPE.SET:
//         value[key] = operation.value
//         break
//     }
//   })
//   return value
// }

// export const applyChanges = (value, changes) => {
//   Object.keys(changes).forEach((key) => {
//     value[key] = changes[key].value
//   })
//   return value
// }

// A diff should look like this
// const diff = [
//   { path: [], value: {} },
//   { path: ['position'], value: {} },
//   { path: ['position', 'x'], value: 5 },
//   { path: ['position', 'y'], value: 6 },
//   { path: ['size'], value: {} },
//   { path: ['size', 'width'], value: 7 },
//   { path: ['size', 'height'], value: 8 },
// ]
export const createDiff = (typeDef, oldValue, newValue) => {
  const diff = []
  typeDef.forEach(({ path }) => {
    const oldValueAtPath = getValueAtPath(oldValue, path)
    const newValueAtPath = getValueAtPath(newValue, path)
    if (oldValueAtPath !== newValueAtPath) {
      diff.push({ path: deepCopy(path), value: deepCopy(newValueAtPath) })
    }
  })
  return diff
}

export const deepPatch = (value, diff) => {
  diff.forEach((patch) => {
    setValueAtPath(value, patch.path, patch.value)
  })
  return value
}

// const tinyMapping = {
//   '/': '/',
//   '/position': '/position',
//   '/position/x': '/position',
//   '/position/y': '/position',
//   '/size': '/size',
//   '/size/width': '/size',
//   '/size/height': '/size',
// }
// This is what the result should look like:
// const groupDiff = {
//   '/': [{ path: [], value: {} }, { path: ['position'], value: {} },],
// }

export const groupDiffByVersions = (tinyMapping, diff) => {
  const groupedDiff = {}
  diff.forEach((patch) => {
    const key = tinyMapping[patch.path]
    groupedDiff[key] = groupedDiff[key] || []
    groupedDiff[key].push(patch)
  })
  return groupedDiff
}

export const constructObjectFromGroupedDiff = (groupedDiff) => {
  const result = {}
  Object.keys(groupedDiff).forEach((key) => {
    const diff = groupedDiff[key]
    result[key] = diff.reduce((value, patch) => {
      return deepPatch(value, [patch])
    })
  })
  return result
}
