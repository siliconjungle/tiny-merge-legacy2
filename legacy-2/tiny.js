export const create = (version, lastUpdatedBy) => {
  return {
    version,
    lastUpdatedBy,
  }
}

export const shouldSetRemote = (tiny, version, lastUpdatedBy) => {
  if (tiny.version > version) {
    return false
  }

  if (tiny.version === version) {
    if (tiny.lastUpdatedBy === lastUpdatedBy) {
      return false
    }

    if (tiny.lastUpdatedBy > lastUpdatedBy) {
      return false
    }
  }

  return true
}

export const shouldSetLocal = (tiny, version, lastUpdatedBy) => {
  if (tiny.version > version) {
    return false
  }

  if (tiny.version === version) {
    if (tiny.lastUpdatedBy === lastUpdatedBy) {
      return true
    }

    if (tiny.lastUpdatedBy > lastUpdatedBy) {
      return false
    }
  }

  return true
}
