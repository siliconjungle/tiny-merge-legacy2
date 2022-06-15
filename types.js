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
