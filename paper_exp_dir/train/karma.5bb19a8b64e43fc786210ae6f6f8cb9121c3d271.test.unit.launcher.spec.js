'use strict'

const di = require('di')

const events = require('../../lib/events')
const launcher = require('../../lib/launcher')
const createMockTimer = require('./mocks/timer')


const stubPromise = (obj, method, stubAction) => {
const promise = new Promise((resolve) => {
obj[method].resolve = resolve
})

sinon.stub(obj, method).callsFake(() => {
if (stubAction) stubAction()

return promise
})
}

function FakeBrowser (id, name, baseBrowserDecorator) {
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
sinon.stub(this, 'start').callsFake(() => {
this.state = this.STATE_BEING_CAPTURED
this._done()
})
stubPromise(this, 'forceKill')
sinon.stub(this, 'restart')
}

function ScriptBrowser (id, name, baseBrowserDecorator) {
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
sinon.stub(this, 'start').callsFake(() => {
this.state = this.STATE_BEING_CAPTURED
this._done()
})
stubPromise(this, 'forceKill')
sinon.stub(this, 'restart')
}

describe('launcher', () => {

let lastGeneratedId = null
launcher.Launcher.generateId = () => ++lastGeneratedId

beforeEach(() => {
lastGeneratedId = 0
FakeBrowser._instances = []
ScriptBrowser._instances = []
})

describe('Launcher', () => {
let emitter
let server
let config
let l

beforeEach(() => {
emitter = new events.EventEmitter()
server = { loadErrors: [] }
config = {
captureTimeout: 0,
protocol: 'http:',
hostname: 'localhost',
port: 1234,
urlRoot: '/root/'
}

const injector = new di.Injector([{
'launcher:Fake': ['type', FakeBrowser],
'launcher:Script': ['type', ScriptBrowser],
server: ['value', server],
emitter: ['value', emitter],
config: ['value', config],
timer: ['factory', createMockTimer]
}])
l = new launcher.Launcher(server, emitter, injector)
})

describe('launch', () => {
it('should inject and start all browsers', (done) => {
l.launch(['Fake'], 1)

const browser = FakeBrowser._instances.pop()
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
server = { loadErrors: [] }
config = {
captureTimeout: 0,
protocol: 'http:',
hostname: 'localhost',
port: 1234,
urlRoot: '/root/',
upstreamProxy: {
path: '/__proxy__/',
hostname: 'proxy',
port: '5678',
protocol: 'https:'
}
}

const injector = new di.Injector([{
'launcher:Fake': ['type', FakeBrowser],
'launcher:Script': ['type', ScriptBrowser],
server: ['value', server],
emitter: ['value', emitter],
config: ['value', config],
timer: ['factory', createMockTimer]
