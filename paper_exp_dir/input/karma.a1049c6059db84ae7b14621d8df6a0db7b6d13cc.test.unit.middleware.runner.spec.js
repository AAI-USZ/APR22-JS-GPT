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
schedule: () => emitter.emit('run_start')
}

emitter = new EventEmitter()
capturedBrowsers = new BrowserCollection(emitter)
fileListMock = {
refresh: () => Promise.resolve(),
addFile: () => null,
removeFile: () => null,
changeFile: () => null
}

nextSpy = sinon.spy()
response = new HttpResponseMock()
})

describe('', () => {
beforeEach(() => {
createHandler()
})

it('should trigger test run and stream the reporter', (done) => {
capturedBrowsers.add(new Browser())
sinon.stub(capturedBrowsers, 'areAllReady').callsFake(() => true)

response.once('end', () => {
expect(nextSpy).to.not.have.been.called
expect(response).to.beServedAs(200, 'result\x1FEXIT10')
done()
})

handler(new HttpRequestMock('/__run__'), response, nextSpy)

mockReporter.write('result')
})

it('should set the empty to 0 if empty results', (done) => {
capturedBrowsers.add(new Browser())
sinon.stub(capturedBrowsers, 'areAllReady').callsFake(() => true)

response.once('end', () => {
expect(nextSpy).to.not.have.been.called
expect(response).to.beServedAs(200, 'result\x1FEXIT00')
done()
})

handler(new HttpRequestMock('/__run__'), response, nextSpy)

mockReporter.write('result')
