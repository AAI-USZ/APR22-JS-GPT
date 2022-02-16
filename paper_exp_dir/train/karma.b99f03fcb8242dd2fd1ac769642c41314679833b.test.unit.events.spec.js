const e = require('../../lib/events')

describe('events', () => {
var emitter

beforeEach(() => {
emitter = new e.EventEmitter()
})

describe('EventEmitter', () => {
it('should emit events', () => {
var spy = sinon.spy()

emitter.on('abc', spy)
emitter.emit('abc')
expect(spy).to.have.been.called
})

describe('bind', () => {
var object = null

beforeEach(() => {

function FB () {};
FB.prototype = {
onPrototypeBar () {}
}
object = new FB()
Object.assign(object, {
onFoo: () => {},
onFooBar: () => {},
foo: () => {}
