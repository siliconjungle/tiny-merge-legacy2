import { getNestedPaths } from './utils.js'
import * as shelf from './shelf.js'
import { getTypeByPath, valueIsType } from './type.js'
import { PRIMITIVE } from './types.js'
import { getValueAtPath, setValueAtPath } from './utils.js'

const paths = getNestedPaths({
  position: { x: 50, y: 50, z: 50 },
  size: { width: 100, height: 100 },
})
console.log(paths)

const shape = {
  position: { x: 50, y: 50 },
  size: { width: 100, height: 100 },
}

const sequence = 0
const userId = 'server'
const shapeVersions = shelf.create(shape, sequence, userId)

console.log('_SHAPE_VERSIONS_', shapeVersions)

const typeDef = [
  { path: [], type: PRIMITIVE.OBJECT },
  { path: ['position'], type: PRIMITIVE.OBJECT },
  { path: ['position', 'x'], type: PRIMITIVE.NUMBER },
  { path: ['position', 'y'], type: PRIMITIVE.NUMBER },
  { path: ['size'], type: PRIMITIVE.OBJECT },
  { path: ['size', 'width'], type: PRIMITIVE.NUMBER },
  { path: ['size', 'height'], type: PRIMITIVE.NUMBER },
]

console.log(getTypeByPath(typeDef, []))
console.log(getTypeByPath(typeDef, ['position', 'x']))
console.log(getTypeByPath(typeDef, ['size']))

console.log(getValueAtPath(['position', 'x'], { position: { x: 50 } }))
console.log(getValueAtPath([], 'Hello world'))
console.log(setValueAtPath(['position', 'x'], { position: { x: 50 } }, 100))
console.log(valueIsType(typeDef, shape))
console.log(valueIsType(typeDef, null))
console.log(valueIsType(typeDef, { position: { x: 50 } }))
