import path from 'path'
import {EventEmitter} from 'events'
import mocks from 'mocks'
import {Promise} from 'bluebird'
import Browser from '../../../lib/browser'
import BrowserCollection from '../../../lib/browser_collection'
import MultReporter from '../../../lib/reporters/multi'
var createRunnerMiddleware = require('../../../lib/middleware/runner').create
var HttpResponseMock = mocks.http.ServerResponse
var HttpRequestMock = mocks.http.ServerRequest

describe('middleware.runner', () => {
var nextSpy
var response
var mockReporter
var capturedBrowsers
var emitter
var config
var executor
var handler
var fileListMock

before(() => {
Promise.setScheduler(fn => fn())
})

after(() => {
Promise.setScheduler(fn => process.nextTick(fn))
})

beforeEach(() => {
mockReporter = {
adapters: [],
write (msg) {
return this.adapters.forEach(adapter => adapter(msg))
}
}

executor = {
schedule: () => emitter.emit('run_start')
}

