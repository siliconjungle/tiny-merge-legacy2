import { deepCopy } from './utils.js'

export const PRIMITIVE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
  NULL: 'null',
}

export const getPrimitive = (value) => {
  if (value === null) {
    return PRIMITIVE.NULL
  }
  if (Array.isArray(value)) {
    return PRIMITIVE.ARRAY
  }
  switch (typeof value) {
    case PRIMITIVE.STRING:
      return PRIMITIVE.STRING
    case PRIMITIVE.NUMBER:
      return PRIMITIVE.NUMBER
    case PRIMITIVE.BOOLEAN:
      return PRIMITIVE.BOOLEAN
    case PRIMITIVE.OBJECT:
      return PRIMITIVE.OBJECT
    default:
      throw new Error(`Unsupported type: ${typeof value}`)
  }
}

export const isPrimitive = (value, primitive) =>
  getPrimitive(value) === primitive

export const getValueAtPath = (value, path) => {
  const primitive = getPrimitive(value)

  if (path.length === 0) {
    return value
  }

  if (primitive === PRIMITIVE.ARRAY) {
    const index = path[0]
    if (index >= value.length) {
      return undefined
    }
    return getValueAtPath(value[index], path.slice(1))
  } else if (primitive === PRIMITIVE.OBJECT) {
    if (value[path[0]] === undefined) {
      return undefined
    }
    return getValueAtPath(value[path[0]], path.slice(1))
  }

  return undefined
}

export const setInnerValueAtPath = (value, path, valueToSet) => {
  if (value === undefined) {
    if (path.length === 0) {
      return valueToSet
    }

    value = valueToSet
  }

  const primitive = getPrimitive(value)

  if (primitive === PRIMITIVE.ARRAY) {
    const index = path[0]
    if (index >= value.length) {
      return valueToSet
    }
    value[index] = setValueAtPath(value[index], path.slice(1), valueToSet)
    return value
  } else if (primitive === PRIMITIVE.OBJECT) {
    if (value[path[0]] === undefined) {
      value[path[0]] = {}
      return value
    }
    value[path[0]] = setValueAtPath(value[path[0]], path.slice(1), valueToSet)
    return value
  }
}

export const setValueAtPath = (value, path, valueToSet) => {
  return setInnerValueAtPath(deepCopy(value), path, valueToSet)
}

export const fromPathToKey = (path) => {
  return `/${path.join('/')}`
}

export const fromKeyToPath = (key) => {
  return key.split('/').slice(1)
}
