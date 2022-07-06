export const create = () => ({})

export const getChild = (collection, id) => {
  return collection[id] ?? null
}

export const setChild = (collection, id, serverVersion) => {
  collection[id] = serverVersion
}

export const getChangesSinceVersion = (collection, serverVersion) =>
  Object.keys(collection).filter((id) => {
    const child = getChild(collection, id)
    return child && child > serverVersion
  })
