import { getPrimitive, PRIMITIVE } from './types.js'

export const deepCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const deepCopy = (data) => JSON.parse(JSON.stringify(data))

export const getNestedPaths = (data, currentPath = [], paths = []) => {
  const primitive = getPrimitive(data)

  paths.push(currentPath)
  if (primitive === PRIMITIVE.ARRAY) {
    for (let i = 0; i < data.length; i++) {
      getNestedPaths(data[i], [...currentPath, i], paths)
    }
  } else if (primitive === PRIMITIVE.OBJECT) {
    for (const key in data) {
      getNestedPaths(data[key], [...currentPath, key], paths)
    }
  }

  return paths
}

export const fromPathToKey = (path) => {
  return `/${path.join('/')}`
}

export const fromKeyToPath = (key) => {
  return key.split('/').slice(1)
}

export const getValueAtPath = (path, data) => {
  return path.reduce((accumulator, value) => {
    return accumulator[value]
  }, data)
}

export const setValueAtPath = (path, data, value) => {
  let dataCopy = deepCopy(data)
  if (path.length === 0) return dataCopy
  let currentData = dataCopy
  for (let i = 0; i < path.length - 1; i++) {
    currentData = currentData[path[i]]
  }
  currentData[path[path.length - 1]] = value
  return dataCopy
}

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
    if (deepCompare(oldValueAtPath, newValueAtPath)) {
      diff.push({ path: deepCopy(path), value: deepCopy(newValueAtPath) })
    }
  })
  return diff
}

export const deepPatch = (value, diff) => {
  let valueCopy = deepCopy(value)
  diff.forEach((patch) => {
    valueCopy = setValueAtPath(value, patch.path, patch.value)
  })
  return valueCopy
}

export const OPERATION = {
  CREATE: 'create',
  UPDATE: 'update',
}

// To filter operations you should look at the base version at the key
// If it doesn't exist you can always create one.
// For updates you need to filter each of the elements in the diff.
// If there are no elements left, then you don't need to apply it.
export const operation = {
  create: (key, value) => [OPERATION.CREATE, key, value],
  update: (key, diff) => [OPERATION.UPDATE, key, diff],
}
