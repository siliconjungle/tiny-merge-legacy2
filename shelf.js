import * as tiny from './tiny.js'
import { getNestedPaths, fromPathToKey } from './utils.js'

export const create = (data, sequence, userId) => {
  const nestedPaths = getNestedPaths(data)
  const shelf = {}
  nestedPaths.forEach((path) => {
    const key = fromPathToKey(path)
    shelf[key] = tiny.create(sequence, userId)
  })
  return shelf
}

export const filterDiffToApply = (shelf, sequence, userId, diff) => {
  const filteredDiff = diff.filter(({ path }) => {
    const key = fromPathToKey(path)
    const tiny = shelf[key]
    return tiny.shouldSet(tiny, sequence, userId)
  })
  return filteredDiff
}

export const setVersionAtPath = (shelf, path, sequence, userId) => {
  shelf[fromPathToKey(path)] = tiny.create(sequence, userId)
}

export const setVersionsFromDiff = (shelf, diff, sequence, userId) => {
  diff.forEach(({ path }) => {
    setVersionAtPath(shelf, path, sequence, userId)
  })
}
