import * as tiny from './tiny.js'

// This is what versioned keys looks like:
// const versionedKeys = ['/', '/position', '/size']
export const create = (version, lastUpdatedBy, versionKeys) => {
  return versionKeys.reduce((obj, key) => {
    obj[key] = tiny.create(version, lastUpdatedBy)
    return obj
  }, {})
}

export const applyLatestVersionToGroup = (
  document,
  version,
  lastUpdatedBy,
  versionKey
) => {
  document[versionKey] = tiny.create(version, lastUpdatedBy)
  return document
}

export const getLatestVersionFromGroup = (document, versionKey) => {
  return document[versionKey]?.version ?? 0
}

export const clearLatestVersionFromGroup = (document, versionKey) => {
  delete document[versionKey]
}

export const hasGroupChanged = (document, key, version, lastUpdatedBy) => {
  const currentTiny = document[key]
  if (currentTiny === undefined) {
    throw new Error(
      `Trying to check if group ${key} has changed, but it doesn't exist`
    )
  }
  return !tiny.shouldUpdateRemote(currentTiny, version, lastUpdatedBy)
}

export const shouldSetGroupLocal = (document, key, version, lastUpdatedBy) => {
  const currentTiny = document[key]
  return (
    currentTiny === undefined ||
    tiny.shouldUpdateLocal(currentTiny, version, lastUpdatedBy)
  )
}

export const shouldSetGroupRemote = (document, key, version, lastUpdatedBy) => {
  const currentTiny = document[key]
  return (
    currentTiny === undefined ||
    tiny.shouldUpdateRemote(currentTiny, version, lastUpdatedBy)
  )
}
