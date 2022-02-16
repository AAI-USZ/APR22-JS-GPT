import Promise from 'bluebird'
import di from 'di'
import events from '../../lib/events'
import launcher from '../../lib/launcher'
import createMockTimer from './mocks/timer'


var stubPromise = (obj, method, stubAction) => {
var promise = new Promise((resolve) => {
obj[method].resolve = resolve
})

sinon.stub(obj, method, () => {
if (stubAction) stubAction()

return promise
})
}

class FakeBrowser {
constructor (id, name, baseBrowserDecorator) {
this.id = id
this.name = name
baseBrowserDecorator(this)
FakeBrowser._instances.push(this)
sinon.stub(this, 'start', () => {
this.state = this.STATE_BEING_CAPTURED
return this.state
})
stubPromise(this, 'forceKill')
sinon.stub(this, 'restart')
}
}

class ScriptBrowser {
constructor (id, name, baseBrowserDecorator) {
this.id = id
this.name = name
baseBrowserDecorator(this)
ScriptBrowser._instances.push(this)
sinon.stub(this, 'start', () => {
this.state = this.STATE_BEING_CAPTURED
})
stubPromise(this, 'forceKill')
sinon.stub(this, 'restart')
}
}

describe('launcher', () => {

var lastGeneratedId = null
launcher.Launcher.generateId = () => {
return ++lastGeneratedId
}

before(() => {
Promise.setScheduler((fn) => fn())
})

after(() => {
Promise.setScheduler((fn) => process.nextTick(fn))
})

beforeEach(() => {
lastGeneratedId = 0
FakeBrowser._instances = []
ScriptBrowser._instances = []
})

describe('Launcher', () => {
var emitter
var server
var l = emitter = server = null

beforeEach(() => {
emitter = new events.EventEmitter()
server = {'loadErrors': []}

var injector = new di.Injector([{
'launcher:Fake': ['type', FakeBrowser],
'launcher:Script': ['type', ScriptBrowser],
