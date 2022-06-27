import Memory from './memory.js'
import History, { operation } from './history.js'
import { PRIMITIVE } from './types.js'

const SERVER_ID = '1234abc'
const USER_ID = '1234def'
const USER_ID2 = '1234ghi'
let serverVersion = [0, SERVER_ID]

const memory = new Memory(SERVER_ID, {
  name: PRIMITIVE.STRING,
  age: PRIMITIVE.NUMBER,
})

memory.setValue('James', { name: 'James', age: 29 }, serverVersion, USER_ID)
serverVersion[0]++
serverVersion[1] = USER_ID
memory.setValue('Jam', { name: 'Jam', age: 27 }, serverVersion, USER_ID2)
serverVersion[0]++
serverVersion[1] = USER_ID2
memory.setValue('Jim', { name: 'Jim', age: 24 }, serverVersion, USER_ID)
serverVersion[0]++
serverVersion[1] = USER_ID
console.log(memory.getValue('James'))
console.log(memory.getValue('Jam'))
console.log(memory.getValue('Jim'))
console.log(memory.where(['age'], '>=', 25))
console.log(memory.getChanges(0, SERVER_ID))
console.log(memory.getChanges(1, USER_ID))
console.log(memory.getChanges(2, USER_ID2))
console.log(memory.getChanges(3, USER_ID))
console.log(memory.getChangesWhere(0, SERVER_ID, ['age'], '>=', 25))

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

// General thoughts on messaging:
// - The first time you connect to the server, get the entire state and the version number.
// - If it's not the first time you connect to the server, send the latest version number and the changes since that version number. (This means that we will need to keep track of all changes made since you've been offline).
// - The server will send back the latest version number and any changes.
// - Any changes made on the server will be sent to you as they happen.
// - If you're online and you make a change you will attempt to push it to the server.
// - If you receive a message from the server, merge it into local storage.
