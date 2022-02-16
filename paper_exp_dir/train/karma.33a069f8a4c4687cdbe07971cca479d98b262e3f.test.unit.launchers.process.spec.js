const path = require('path')
const _ = require('lodash')

const BaseLauncher = require('../../../lib/launchers/base')
const RetryLauncher = require('../../../lib/launchers/retry')
const CaptureTimeoutLauncher = require('../../../lib/launchers/capture_timeout')
const ProcessLauncher = require('../../../lib/launchers/process')
const EventEmitter = require('../../../lib/events').EventEmitter
const createMockTimer = require('../mocks/timer')

describe('launchers/process.js', () => {
let emitter
let mockSpawn
let mockTempDir
let launcher

const BROWSER_PATH = path.normalize('/usr/bin/browser')

beforeEach(() => {
emitter = new EventEmitter()
launcher = new BaseLauncher('fake-id', emitter)

mockSpawn = sinon.spy(function (cmd, args) {
const process = new EventEmitter()
process.stdout = new EventEmitter()
process.stderr = new EventEmitter()
process.kill = sinon.spy()
process.exitCode = null
mockSpawn._processes.push(process)
return process
})

mockSpawn._processes = []

mockTempDir = {
getPath: (suffix) => `/temp${suffix}`,
create: sinon.spy(),
remove: sinon.spy()
}
})

it('should create a temp directory', () => {
ProcessLauncher.call(launcher, mockSpawn, mockTempDir)
launcher._getCommand = () => null

launcher.start('http://host:9988/')
expect(launcher._tempDir).to.equal('/temp/karma-fake-id')
expect(mockTempDir.create).to.have.been.calledWith('/temp/karma-fake-id')
})

it('should remove the temp directory', (done) => {
ProcessLauncher.call(launcher, mockSpawn, mockTempDir)
launcher._getCommand = () => null

launcher.start('http://host:9988/')
launcher.kill()

_.defer(() => {
expect(mockTempDir.remove).to.have.been.called
expect(mockTempDir.remove.args[0][0]).to.equal('/temp/karma-fake-id')
done()
})
})

describe('_normalizeCommand', () => {
it('should remove quotes from the cmd', () => {
ProcessLauncher.call(launcher, null, mockTempDir)

expect(launcher._normalizeCommand('"/bin/brow ser"')).to.equal(path.normalize('/bin/brow ser'))
expect(launcher._normalizeCommand("'/bin/brow ser'")).to.equal
path.normalize('/bin/brow ser')
expect(launcher._normalizeCommand('`/bin/brow ser`')).to.equal(path.normalize('/bin/brow ser'))
})
})

describe('with RetryLauncher', () => {
it('should handle spawn ENOENT error and not even retry', (done) => {
ProcessLauncher.call(launcher, mockSpawn, mockTempDir)
RetryLauncher.call(launcher, 2)
launcher._getCommand = () => BROWSER_PATH

const failureSpy = sinon.spy()
emitter.on('browser_process_failure', failureSpy)

launcher.start('http://host:9876/')
mockSpawn._processes[0].emit('error', { code: 'ENOENT' })
mockSpawn._processes[0].emit('exit', 1)
mockTempDir.remove.callArg(1)

_.defer(() => {
expect(launcher.state).to.equal(launcher.STATE_FINISHED)
expect(failureSpy).to.have.been.called
done()
})
})

it('should handle spawn EACCES error and not even retry', (done) => {
ProcessLauncher.call(launcher, mockSpawn, mockTempDir)
RetryLauncher.call(launcher, 2)
launcher._getCommand = () => BROWSER_PATH

const failureSpy = sinon.spy()
emitter.on('browser_process_failure', failureSpy)

launcher.start('http://host:9876/')
mockSpawn._processes[0].emit('error', { code: 'EACCES' })
mockSpawn._processes[0].emit('exit', 1)
mockTempDir.remove.callArg(1)

_.defer(() => {
expect(launcher.state).to.equal(launcher.STATE_FINISHED)
expect(failureSpy).to.have.been.called
done()
})
})
})


describe('flow', () => {
let failureSpy
let mockTimer = failureSpy = null

beforeEach(() => {
mockTimer = createMockTimer()
CaptureTimeoutLauncher.call(launcher, mockTimer, 100)
ProcessLauncher.call(launcher, mockSpawn, mockTempDir, mockTimer)
RetryLauncher.call(launcher, 2)

launcher._getCommand = () => BROWSER_PATH

failureSpy = sinon.spy()
emitter.on('browser_process_failure', failureSpy)
})


it('start -> capture -> kill', async () => {

launcher.start('http://localhost/')
expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])


launcher.markCaptured()


const killingLauncher = launcher.kill()
expect(launcher.state).to.equal(launcher.STATE_BEING_KILLED)
expect(mockSpawn._processes[0].kill).to.have.been.called


mockSpawn._processes[0].emit('exit', 0)
mockTempDir.remove.callArg(1)

await killingLauncher

expect(launcher.state).to.equal(launcher.STATE_FINISHED)
})


it('start -> timeout -> restart', (done) => {
const stdOutSpy = sinon.spy(launcher, '_onStdout')
const stdErrSpy = sinon.spy(launcher, '_onStderr')


launcher.start('http://localhost/')
