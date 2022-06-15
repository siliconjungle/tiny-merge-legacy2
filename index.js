import Memory from './memory.js'
import History, { operation } from './history-reversable.js'
import { PRIMITIVE } from './types.js'

const SERVER_ID = '1234abc'

const lwwSet = new Memory(SERVER_ID, {
  name: PRIMITIVE.STRING,
  age: PRIMITIVE.STRING,
})

lwwSet.setValue('James', { name: 'James', age: 29 }, 'user1')
lwwSet.setValue('Jam', { name: 'Jam', age: 27 }, 'user2')
lwwSet.setValue('Jim', { name: 'Jim', age: 24 }, 'user3')
console.log(lwwSet.getValue('James'))
console.log(lwwSet.getValue('Jam'))
console.log(lwwSet.getValue('Jim'))
console.log(lwwSet.where(['age'], '>=', 25))

// The history is currently not connected to the memory. It will be in the future however.
const history = new History()

history.push([
  operation.create('Bob', { name: 'Bob', age: 47 }),
  operation.create('Sally', { name: 'Sally', age: 52 }),
])

history.push([operation.set('Sally', { name: 'Sally', age: 49 })])

console.log(history.get())

console.log('_STATE_', history.state)

history.undo()

console.log('_STATE_', history.state)

history.redo()

console.log('_STATE_', history.state)

history.undo()

history.push([operation.set('Bob', { name: 'Bob', age: 53 })])

console.log('_STATE_', history.state)

history.undo()

console.log('_STATE_', history.state)
