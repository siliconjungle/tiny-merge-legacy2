import { deepCompare, getNestedPaths, getValueAtPath } from './utils.js'
import { getPrimitive } from './types.js'

// const typeDef = [
//   { path: [], type: PRIMITIVE.OBJECT },
//   { path: ['position'], type: PRIMITIVE.OBJECT },
//   { path: ['position', 'x'], type: PRIMITIVE.NUMBER },
//   { path: ['position', 'y'], type: PRIMITIVE.NUMBER },
//   { path: ['size'], type: PRIMITIVE.OBJECT },
//   { path: ['size', 'width'], type: PRIMITIVE.NUMBER },
//   { path: ['size', 'height'], type: PRIMITIVE.NUMBER },
// ]
export const create = (definition) => {
  return definition
}

export const getTypeByPath = (definition, path) => {
  return definition.find((type) => deepCompare(type.path, path))?.type
}

export const valueIsType = (definition, value) => {
  const nestedPaths = getNestedPaths(value)
  if (nestedPaths.length !== definition.length) {
    return false
  }
  const pathsMatch = nestedPaths.every((path) =>
    getTypeByPath(definition, path)
  )
  if (!pathsMatch) return false

  return definition.every((type) => {
    const { path } = type
    const valueAtPath = getValueAtPath(path, value)
    return getPrimitive(valueAtPath) === type.type
  })
}
