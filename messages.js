export const CLIENT_MESSAGE = {
  CONNECT: 'connect',
  PATCH: 'patch',
}

export const SERVER_MESSAGE = {
  CONNECT: 'connect',
  PATCH: 'patch',
}

export const createClientMessage = {
  connect: (latestVersion, operations) => [
    CLIENT_MESSAGE.CONNECT,
    latestVersion,
    operations,
  ],
  patch: (operations) => [CLIENT_MESSAGE.PATCH, operations],
}

export const createServerMessage = {
  patch: (latestVersion, operations) => [
    SERVER_MESSAGE.PATCH,
    latestVersion,
    operations,
  ],
}

export const createOperation = (id, version, value) => [id, version, value]
