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
