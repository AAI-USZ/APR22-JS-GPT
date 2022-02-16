import Promise from 'bluebird'
import di from 'di'
import events from '../../lib/events'
import launcher from '../../lib/launcher'
import createMockTimer from './mocks/timer'


var stubPromise = (obj, method, stubAction) => {
var promise = new Promise(resolve => {
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
Promise.setScheduler(fn => fn())
})

after(() => {
Promise.setScheduler(fn => process.nextTick(fn))
})

beforeEach(() => {
lastGeneratedId = 0
FakeBrowser._instances = []
ScriptBrowser._instances = []
})

describe('Launcher', () => {
var emitter
var l = emitter = null

beforeEach(() => {
emitter = new events.EventEmitter()
var injector = new di.Injector([{
'launcher:Fake': ['type', FakeBrowser],
'launcher:Script': ['type', ScriptBrowser],
'emitter': ['value', emitter],
'config': ['value', {captureTimeout: 0}],
'timer': ['factory', createMockTimer]
}])
l = new launcher.Launcher(emitter, injector)
})

describe('launch', () => {
it('should inject and start all browsers', () => {
l.launch(['Fake'], 'http:', 'localhost', 1234, '/root/', 1)

var browser = FakeBrowser._instances.pop()
expect(browser.start).to.have.been.calledWith('http://localhost:1234/root/')
expect(browser.id).to.equal(lastGeneratedId)
expect(browser.name).to.equal('Fake')
})

it('should allow launching a script', () => {
l.launch(['/usr/local/bin/special-browser'], 'http:', 'localhost', 1234, '/', 1)

var script = ScriptBrowser._instances.pop()
expect(script.start).to.have.been.calledWith('http://localhost:1234/')
expect(script.name).to.equal('/usr/local/bin/special-browser')
})

it('should use the non default host', () => {
l.launch(['Fake'], 'http:', 'whatever', 1234, '/root/', 1)

var browser = FakeBrowser._instances.pop()
expect(browser.start).to.have.been.calledWith('http://whatever:1234/root/')
})

it('should only launch the specified number of browsers at once', () => {
l.launch([
'Fake',
'Fake',
'Fake'
], 'http:', 'whatever', 1234, '/root/', 2)
