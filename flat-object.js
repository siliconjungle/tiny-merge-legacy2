import * as tiny from './tiny.js'

// This commented out part is going to be used for when data is reloaded from a db.
export const create = (/* value, serverId */) => {
  const flatObject = {}
  // for (const key in value) {
  //   flatObject[key] = tiny.create(value[key], serverId)
  // }
  return flatObject
}

export const setChildByKey = (flatObject, key, value, version, serverId) => {
  if (flatObject[key] === undefined) {
    flatObject[key] = tiny.create(value, version, serverId)
    return flatObject[key]
  } else {
    return tiny.update(flatObject[key], value, version, serverId)
  }
}

export const clearChildByKey = (flatObject, key) => {
  delete flatObject[key]
}

export const getChildByKey = (flatObject, key) => {
  return flatObject[key] ?? null
}

export const hasChildChanged = (flatObject, version, serverId, key) => {
  const value = flatObject[key]
  return !tiny.shouldUpdate(value, version, serverId)
}

export const getChangesSinceVersion = (flatObject, version, serverId) => {
  const changes = {}
  for (const key in flatObject) {
    const value = flatObject[key]
    if (!tiny.shouldUpdate(value, version, serverId)) {
      changes[key] = value
    }
  }
  return changes
}
