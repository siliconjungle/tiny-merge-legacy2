import * as tiny from './tiny.js'

// This commented out part is going to be used for when data is reloaded from a db.
export const create = (/* value, serverId */) => {
  const flatObject = {}
  // for (const key in value) {
  //   flatObject[key] = tiny.create(value[key], serverId)
  // }
  return flatObject
}

export const setChildByKey = (flatObject, key, value, version, userId) => {
  if (flatObject[key] === undefined) {
    flatObject[key] = tiny.create(value, version, userId)
    return flatObject[key]
  } else {
    return tiny.update(flatObject[key], value, version, userId)
  }
}

export const clearChildByKey = (flatObject, key) => {
  delete flatObject[key]
}

export const getChildByKey = (flatObject, key) => {
  return flatObject[key] ?? null
}

export const hasChildChanged = (flatObject, version, userId, key) => {
  const value = flatObject[key]
  return !tiny.shouldUpdate(value, version, userId)
}

export const getChangesSinceVersion = (flatObject, version, userId) => {
  const changes = {}
  for (const key in flatObject) {
    const value = flatObject[key]
    if (!tiny.shouldUpdate(value, version, userId)) {
      changes[key] = value
    }
  }
  return changes
}
