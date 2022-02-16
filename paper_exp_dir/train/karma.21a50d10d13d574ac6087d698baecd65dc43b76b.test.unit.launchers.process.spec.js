import path from 'path'
var _ = require('../../../lib/helper')._
import BaseLauncher from '../../../lib/launchers/base'
import RetryLauncher from '../../../lib/launchers/retry'
import CaptureTimeoutLauncher from '../../../lib/launchers/capture_timeout'
import ProcessLauncher from '../../../lib/launchers/process'
import {EventEmitter} from '../../../lib/events'
import createMockTimer from '../mocks/timer'

describe('launchers/process.js', () => {
var emitter
var mockSpawn
var mockTempDir
var launcher

var BROWSER_PATH = path.normalize('/usr/bin/browser')

beforeEach(() => {
emitter = new EventEmitter()
launcher = new BaseLauncher('fake-id', emitter)

mockSpawn = sinon.spy(function (cmd, args) {
var process = new EventEmitter()
process.stderr = new EventEmitter()
process.kill = sinon.spy()
process.exitCode = null
mockSpawn._processes.push(process)
return process
})

mockSpawn._processes = []

mockTempDir = {
getPath: suffix => `/temp${suffix}`,
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

var failureSpy = sinon.spy()
emitter.on('browser_process_failure', failureSpy)

launcher.start('http://host:9876/')
mockSpawn._processes[0].emit('error', {code: 'ENOENT'})
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
var failureSpy
var mockTimer = failureSpy = null

beforeEach(() => {
mockTimer = createMockTimer()
CaptureTimeoutLauncher.call(launcher, mockTimer, 100)
ProcessLauncher.call(launcher, mockSpawn, mockTempDir, mockTimer)
RetryLauncher.call(launcher, 2)

launcher._getCommand = () => BROWSER_PATH

failureSpy = sinon.spy()
emitter.on('browser_process_failure', failureSpy)
})


it('start -> capture -> kill', (done) => {

launcher.start('http://localhost/')
expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])


launcher.markCaptured()


var killingLauncher = launcher.kill()
expect(launcher.state).to.equal(launcher.STATE_BEING_KILLED)
expect(mockSpawn._processes[0].kill).to.have.been.called


mockSpawn._processes[0].emit('exit', 0)
mockTempDir.remove.callArg(1)

killingLauncher.done(() => {
expect(launcher.state).to.equal(launcher.STATE_FINISHED)
done()
})
})


it('start -> timeout -> restart', (done) => {

launcher.start('http://localhost/')


expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
var browserProcess = mockSpawn._processes.shift()


mockTimer.wind(101)


expect(browserProcess.kill).to.have.been.called
browserProcess.emit('exit', 0)
mockTempDir.remove.callArg(1)
mockSpawn.reset()

_.defer(() => {

expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
expect(failureSpy).not.to.have.been.called
done()
})
})

it('start -> timeout -> 3xrestart -> failure', (done) => {

launcher.start('http://localhost/')


expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
var browserProcess = mockSpawn._processes.shift()
mockSpawn.reset()


mockTimer.wind(101)


expect(browserProcess.kill).to.have.been.called
browserProcess.emit('exit', 0)
mockTempDir.remove.callArg(1)
mockTempDir.remove.reset()

_.defer(() => {

expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
browserProcess = mockSpawn._processes.shift()
expect(failureSpy).not.to.have.been.called
mockSpawn.reset()


mockTimer.wind(101)


expect(browserProcess.kill).to.have.been.called
browserProcess.emit('exit', 0)
mockTempDir.remove.callArg(1)
mockTempDir.remove.reset()

_.defer(() => {

expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
browserProcess = mockSpawn._processes.shift()
expect(failureSpy).not.to.have.been.called
mockSpawn.reset()


mockTimer.wind(201)


expect(browserProcess.kill).to.have.been.called
browserProcess.emit('exit', 0)
mockTempDir.remove.callArg(1)
mockTempDir.remove.reset()

_.defer(() => {
expect(mockSpawn).to.not.have.been.called
expect(failureSpy).to.have.been.called
done()
})
})
})
})


it('start -> crash -> restart', (done) => {

launcher.start('http://localhost/')


expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
var browserProcess = mockSpawn._processes.shift()
mockSpawn.reset()


browserProcess.emit('exit', 1)
mockTempDir.remove.callArg(1)
mockTempDir.remove.reset()

_.defer(() => {

expect(mockSpawn).to.have.been.calledWith(BROWSER_PATH, ['http://localhost/?id=fake-id'])
browserProcess = mockSpawn._processes.shift()

expect(failureSpy).not.to.have.been.called
done()
})
})
})
})
