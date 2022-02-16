const path = require('path')
const EventEmitter = require('events').EventEmitter
const mocks = require('mocks')
const Promise = require('bluebird')
const _ = require('lodash')

const Browser = require('../../../lib/browser')
const BrowserCollection = require('../../../lib/browser_collection')
const MultReporter = require('../../../lib/reporters/multi')
const createRunnerMiddleware = require('../../../lib/middleware/runner').create

const HttpResponseMock = mocks.http.ServerResponse
const HttpRequestMock = mocks.http.ServerRequest

describe('middleware.runner', () => {
let nextSpy
let response
let mockReporter
let capturedBrowsers
let emitter
let config
let executor
let handler
let fileListMock

function createHandler () {
handler = createRunnerMiddleware(
emitter,
fileListMock,
capturedBrowsers,
new MultReporter([mockReporter]),
executor,
'http:',
'localhost',
8877,
'/',
config
)
}

before(() => {
Promise.setScheduler((fn) => fn())
})

after(() => {
Promise.setScheduler((fn) => process.nextTick(fn))
})

beforeEach(() => {
mockReporter = {
adapters: [],
write (msg) {
return this.adapters.forEach((adapter) => adapter(msg))
}
}

executor = {
scheduled: false,
schedule: () => {
executor.scheduled = true
emitter.emit('run_start')
if (executor.onSchedule) {
executor.onSchedule()
}
}
}

