// types are defined as json objects where each field's value is the primitive type.
// arrays and objects represent their own type.
// e.g. { name: string, age: number, position: { x: number, y: number } }

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

const getPrimitiveFromType = (type) => {
  const typePrimitive = getPrimitive(type)
  return typePrimitive === PRIMITIVE.STRING ? type : typePrimitive
}

export const valueIsType = (value, type) => {
  const primitive = getPrimitive(value)
  const typePrimitive = getPrimitiveFromType(type)

  if (primitive !== typePrimitive) {
    return false
  }

  if (primitive === PRIMITIVE.ARRAY) {
    return value.every((v, i) => valueIsType(v, type[i]))
  }

  if (primitive === PRIMITIVE.OBJECT) {
    return Object.keys(value).every((k) => valueIsType(value[k], type[k]))
  }

  return true
}

export const deepPatch = (data, partial) => {
  const dataPrimitive = getPrimitive(data)
  const partialPrimitive = getPrimitive(partial)

  if (
    partial === undefined ||
    dataPrimitive !== partialPrimitive ||
    partialPrimitive !== PRIMITIVE.OBJECT
  ) {
    return partial
  }

  // Doing partial merges of arrays is complicated (unless the patch is a list of operations to each field)
  // For now lets treat arrays like standard fields. (Unless we have a specific need for them)
  const dataKeys = Object.keys(data)
  const partialKeys = Object.keys(partial)
  const keys = new Set([...dataKeys, ...partialKeys])

  return Array.from(keys).reduce((acc, key) => {
    const dataValue = data[key]
    const partialValue = partial[key]

    if (dataValue === undefined) {
      return { ...acc, [key]: partialValue }
    }

    if (partialValue === undefined) {
      return { ...acc, [key]: dataValue }
    }

    return {
      ...acc,
      [key]: deepPatch(dataValue, partialValue),
    }
  }, {})
}
