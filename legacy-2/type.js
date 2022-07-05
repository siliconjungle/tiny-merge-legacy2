import { fromPathToKey } from './types.js'

// Type definitions look like this:
// const typeDef = [
//   { path: [], type: PRIMITIVE.OBJECT, versioned: true },
//   { path: ['position'], type: PRIMITIVE.OBJECT, versioned: true },
//   { path: ['position', 'x'], type: PRIMITIVE.NUMBER },
//   { path: ['position', 'y'], type: PRIMITIVE.NUMBER },
//   { path: ['size'], type: PRIMITIVE.OBJECT, versioned: true },
//   { path: ['size', 'width'], type: PRIMITIVE.NUMBER },
//   { path: ['size', 'height'], type: PRIMITIVE.NUMBER },
// ]
export const create = (definition) => {
  return {
    definition,
    mapping: createMappingFromTypeDef(definition),
  }
}

// Each path in the typeDef should be a key within the mapping.
// The value at each path should be the path to the closest parent register which has versioned: true.
// Result looks like this:
// const mapping = {
//   '/': '/',
//   '/position': '/position',
//   '/position/x': '/position',
//   '/position/y': '/position',
//   '/size': '/size',
//   '/size/width': '/size',
//   '/size/height': '/size',
// }
export const createMappingFromTypeDefinition = (definition) => {
  const mapping = {}

  definition.forEach(({ path }) => {
    const versionedAncestor = getSelfOrClosestAncestorWithVersioned(
      definition,
      path
    )
    if (!versionedAncestor) {
      throw new Error(`No versioned ancestor found for path: ${path}`)
    }
    mapping[fromPathToKey(path)] = fromPathToKey(versionedAncestor.path)
  })

  return mapping
}

export const getTypeByPath = (definition, path) => {
  return definition.find((type) => deepCompare(type.path, path))
}

export const getSelfOrClosestAncestorWithVersioned = (definition, path) => {
  let currentPath = path
  while (currentPath.length > 0) {
    const type = getTypeByPath(definition, currentPath)
    if (type && type.versioned) {
      return type
    }
    currentPath = currentPath.slice(0, -1)
  }
  return null
}

export const valueIsType = (value, definition) => {
  return definition.every((type) => {
    const { path } = type
    const valueAtPath = getValueAtPath(value, path)
    return getPrimitive(valueAtPath) === type
  })
}
