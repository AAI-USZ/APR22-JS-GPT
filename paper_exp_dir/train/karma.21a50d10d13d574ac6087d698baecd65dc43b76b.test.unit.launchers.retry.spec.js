import BaseLauncher from '../../../lib/launchers/base'
import RetryLauncher from '../../../lib/launchers/retry'
import {EventEmitter} from '../../../lib/events'
var _ = require('../../../lib/helper')._

describe('launchers/retry.js', () => {
var emitter
var launcher

beforeEach(() => {
emitter = new EventEmitter()
launcher = new BaseLauncher('fake-id', emitter)
})

it('should restart if browser crashed', (done) => {
RetryLauncher.call(launcher, 2)

launcher.start('http://localhost:9876')

sinon.spy(launcher, 'start')
var spyOnBrowserProcessFailure = sinon.spy()
emitter.on('browser_process_failure', spyOnBrowserProcessFailure)


launcher._done('crash')

_.defer(() => {
expect(launcher.start).to.have.been.called
expect(spyOnBrowserProcessFailure).not.to.have.been.called
done()
})
})

it('should eventually fail with "browser_process_failure"', (done) => {
RetryLauncher.call(launcher, 2)

launcher.start('http://localhost:9876')

sinon.spy(launcher, 'start')
var spyOnBrowserProcessFailure = sinon.spy()
emitter.on('browser_process_failure', spyOnBrowserProcessFailure)


launcher._done('crash')

_.defer(() => {
expect(launcher.start).to.have.been.called
expect(spyOnBrowserProcessFailure).not.to.have.been.called
launcher.start.reset()


launcher._done('crash')

_.defer(() => {
expect(launcher.start).to.have.been.called
expect(spyOnBrowserProcessFailure).not.to.have.been.called
launcher.start.reset()


launcher._done('crash')

_.defer(() => {
expect(launcher.start).not.to.have.been.called
expect(spyOnBrowserProcessFailure).to.have.been.called
done()
})
})
})
})

it('should not restart if killed normally', (done) => {
RetryLauncher.call(launcher, 2)

launcher.start('http://localhost:9876')

sinon.spy(launcher, 'start')
var spyOnBrowserProcessFailure = sinon.spy()
emitter.on('browser_process_failure', spyOnBrowserProcessFailure)


launcher._done()

_.defer(() => {
expect(launcher.start).not.to.have.been.called
expect(spyOnBrowserProcessFailure).not.to.have.been.called
expect(launcher.state).to.equal(launcher.STATE_FINISHED)
done()
})
})
})
