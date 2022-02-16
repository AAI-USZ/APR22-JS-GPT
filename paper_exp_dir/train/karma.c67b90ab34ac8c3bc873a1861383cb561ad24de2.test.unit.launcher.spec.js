'use strict'

const Promise = require('bluebird')
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
let emitter
let server
