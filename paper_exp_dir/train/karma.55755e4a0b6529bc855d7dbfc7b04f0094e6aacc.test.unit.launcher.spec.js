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
this.DEFAULT_CMD = {
linux: '/script',
darwin: '/script',
win32: 'script.exe'
}
this.ENV_CMD = 'SCRIPT_BIN'

baseBrowserDecorator(this)
FakeBrowser._instances.push(this)
sinon.stub(this, 'start', () => {
this.state = this.STATE_BEING_CAPTURED
this._done()
})
stubPromise(this, 'forceKill')
sinon.stub(this, 'restart')
}
}

class ScriptBrowser {
constructor (id, name, baseBrowserDecorator) {
this.id = id
this.name = name
this.DEFAULT_CMD = {
linux: '/script',
darwin: '/script',
win32: 'script.exe'
}
this.ENV_CMD = 'SCRIPT_BIN'

baseBrowserDecorator(this)
ScriptBrowser._instances.push(this)
sinon.stub(this, 'start', () => {
this.state = this.STATE_BEING_CAPTURED
this._done()
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
var config
var l

beforeEach(() => {
emitter = new events.EventEmitter()
server = {'loadErrors': []}
config = {
captureTimeout: 0,
protocol: 'http:',
hostname: 'localhost',
port: 1234,
urlRoot: '/root/'
}

var injector = new di.Injector([{
'launcher:Fake': ['type', FakeBrowser],
'launcher:Script': ['type', ScriptBrowser],
'server': ['value', server],
'emitter': ['value', emitter],
'config': ['value', config],
'timer': ['factory', createMockTimer]
}])
l = new launcher.Launcher(server, emitter, injector)
})

describe('launch', () => {
it('should inject and start all browsers', (done) => {
l.launch(['Fake'], 1)

var browser = FakeBrowser._instances.pop()
l.jobs.on('end', () => {
expect(browser.start).to.have.been.calledWith('http://localhost:1234/root/')
expect(browser.id).to.equal(lastGeneratedId)
expect(browser.name).to.equal('Fake')
done()
})
})

describe('with upstream proxy settings', () => {
beforeEach(() => {
emitter = new events.EventEmitter()
server = {'loadErrors': []}
config = {
captureTimeout: 0,
protocol: 'http:',
hostname: 'localhost',
port: 1234,
urlRoot: '/root/',
