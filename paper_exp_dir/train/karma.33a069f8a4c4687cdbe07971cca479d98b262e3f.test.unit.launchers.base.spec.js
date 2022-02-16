const _ = require('lodash')

const BaseLauncher = require('../../../lib/launchers/base')
const EventEmitter = require('../../../lib/events').EventEmitter

describe('launchers/base.js', () => {
let emitter
let launcher

beforeEach(() => {
emitter = new EventEmitter()
launcher = new BaseLauncher('fake-id', emitter)
})

it('should manage state', () => {
launcher.start('http://localhost:9876/')
expect(launcher.state).to.equal(launcher.STATE_BEING_CAPTURED)

launcher.markCaptured()
expect(launcher.state).to.equal(launcher.STATE_CAPTURED)
expect(launcher.isCaptured()).to.equal(true)
})

describe('start', () => {
it('should fire "start" event and pass url with id', () => {
const spyOnStart = sinon.spy()
launcher.on('start', spyOnStart)
launcher.start('http://localhost:9876/')

expect(spyOnStart).to.have.been.calledWith('http://localhost:9876/?id=fake-id')
})
})

describe('restart', () => {
it('should kill running browser and start with previous url', (done) => {
const spyOnStart = sinon.spy()
const spyOnKill = sinon.spy()
launcher.on('start', spyOnStart)
launcher.on('kill', spyOnKill)

launcher.start('http://host:9988/')
spyOnStart.resetHistory()

launcher.restart()
expect(spyOnKill).to.have.been.called
expect(spyOnStart).to.not.have.been.called


launcher._done()
spyOnKill.callArg(0)

_.defer(() => {
expect(spyOnStart).to.have.been.calledWith('http://host:9988/?id=fake-id')
done()
})
})

it('should start when already finished (crashed)', (done) => {
const spyOnStart = sinon.spy()
const spyOnKill = sinon.spy()
const spyOnDone = sinon.spy()
launcher.on('start', spyOnStart)
launcher.on('kill', spyOnKill)

launcher.on('done', () => launcher.restart())
launcher.on('done', spyOnDone)

launcher.start('http://host:9988/')
spyOnStart.resetHistory()



launcher._done('crashed')

_.defer(() => {
expect(spyOnKill).to.not.have.been.called
expect(spyOnStart).to.have.been.called
expect(spyOnDone).to.have.been.called
expect(spyOnDone).to.have.been.calledBefore(spyOnStart)
done()
})
})

it('should not restart when being force killed', async () => {
const spyOnStart = sinon.spy()
const spyOnKill = sinon.spy()
launcher.on('start', spyOnStart)
launcher.on('kill', spyOnKill)

launcher.start('http://host:9988/')
spyOnStart.resetHistory()

const onceKilled = launcher.forceKill()

launcher.restart()


launcher._done()
spyOnKill.callArg(0)

await onceKilled
expect(spyOnStart).to.not.have.been.called
})
})

describe('kill', () => {
it('should manage state', async () => {
const onceKilled = launcher.kill()
expect(launcher.state).to.equal(launcher.STATE_BEING_KILLED)

await onceKilled
