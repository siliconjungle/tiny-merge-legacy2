const QUERY_OPERATOR = {
  LESS_THAN: '<',
  LESS_THAN_OR_EQUAL: '<=',
  EQUAL_TO: '==',
  GREATER_THAN: '>',
  GREATER_THAN_OR_EQUAL: '>=',
  NOT_EQUAL_TO: '!=',
  // ARRAY_CONTAINS: 'array-contains',
  // ARRAY_CONTAINS_ANY: 'array-contains-any',
  // IN: 'in',
  // NOT_IN: 'not-in',
}

const filterByPath = (path, documents) => {
  return documents.filter(({ _, value: { value } }) => {
    for (const key of path) {
      if (value[key] === undefined) {
        return false
      }
    }
    return true
  })
}

const getValueAtPath = (path, value) => {
  let queriedValue = value
  for (const key of path) {
    queriedValue = queriedValue[key]
  }
  return queriedValue
}

const queryLessThan = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) < value
  )
}

const queryLessThanOrEqual = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) <= value
  )
}

const queryEqualTo = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) === value
  )
}

const queryGreaterThan = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) > value
  )
}

const queryGreaterThanOrEqual = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) >= value
  )
}

const queryNotEqual = (path, documents, value) => {
  return documents.filter(
    (document) => getValueAtPath(path, document.value.value) !== value
  )
}

// Very simple implementation, requires limits & faster lookup.
export const where = (values, path, operator, value) => {
  const documents = Object.entries(values).map(([key, value]) => ({
    key,
    value,
  }))
  const filteredDocuments = filterByPath(path, documents)
  switch (operator) {
    case QUERY_OPERATOR.LESS_THAN:
      return queryLessThan(path, filteredDocuments, value)
    case QUERY_OPERATOR.LESS_THAN_OR_EQUAL:
      return queryLessThanOrEqual(path, filteredDocuments, value)
    case QUERY_OPERATOR.EQUAL_TO:
      return queryEqualTo(path, filteredDocuments, value)
    case QUERY_OPERATOR.GREATER_THAN:
      return queryGreaterThan(path, filteredDocuments, value)
    case QUERY_OPERATOR.GREATER_THAN_OR_EQUAL:
      return queryGreaterThanOrEqual(path, filteredDocuments, value)
    case QUERY_OPERATOR.NOT_EQUAL_TO:
      return queryNotEqual(path, filteredDocuments, value)
  }
  return []
}
