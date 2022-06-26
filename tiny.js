export const create = (value, version, serverId) => {
  return {
    value,
    version,
    lastUpdatedBy: serverId,
  }
}

export const shouldUpdate = (data, version, serverId) => {
  if (data.version > version) {
    return false
  }

  if (data.version === version) {
    if (data.lastUpdatedBy === serverId) {
      return false
    }

    if (data.lastUpdatedBy > serverId) {
      return false
    }
  }

  return true
}

export const update = (data, value, version, serverId) => {
  if (!shouldUpdate(data, version, serverId)) {
    return null
  }

  return {
    value,
    version,
    lastUpdatedBy: serverId,
  }
}
