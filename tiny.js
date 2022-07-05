export const create = (sequence, userId) => [sequence, userId]

export const shouldSet = (tiny, sequence, userId) =>
  sequence > tiny[0] || (sequence === tiny[0] && userId > tiny[1])
