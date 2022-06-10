export const create = (value, userId, version = 0) => {
  return {
    value,
    version,
    createdBy: userId,
    lastUpdatedBy: userId,
  }
}

export const shouldUpdate = (data, version, userId) => {
  if (data.version > version) {
    return false
  }

  if (data.version === version) {
    if (data.lastUpdatedBy === userId) {
      return false
    }

    if (data.lastUpdatedBy > userId) {
      return false
    }
  }

  return true
}

export const update = (data, value, version, userId) => {
  if (!shouldUpdate(data, version, userId)) {
    return null
  }

  return {
    value,
    version,
    createdBy: data.createdBy,
    lastUpdatedBy: userId,
  }
}
