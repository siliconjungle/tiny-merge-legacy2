export const create = () => {
  return {}
}

export const setDocumentByKey = (collection, key, document) => {
  collection[key] = document
  return collection[key]
}

export const clearDocumentByKey = (collection, key) => {
  delete collection[key]
}

export const getDocumentByKey = (collection, key) => {
  return collection[key] ?? null
}
