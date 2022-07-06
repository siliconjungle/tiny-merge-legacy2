import * as tiny from './tiny.js'

export const create = () => ({})

export const getChild = (collection, id) => {
  return collection[id] ?? null
}

export const setChild = (collection, id, sequence, userId) => {
  collection[id] = tiny.create(sequence, userId)
}

export const shouldSetChild = (collection, id, sequence, userId) => {
  const version = getChild(collection, id)
  return version === null || tiny.shouldSet(version, sequence, userId)
}
