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
config = {client: {}, basePath: '/'}

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
})

it('should trigger test run and stream the reporter', (done) => {
capturedBrowsers.add(new Browser())
sinon.stub(capturedBrowsers, 'areAllReady', () => true)

response.once('end', () => {
expect(nextSpy).to.not.have.been.called
expect(response).to.beServedAs(200, 'result\x1FEXIT10')
done()
})

handler(new HttpRequestMock('/__run__'), response, nextSpy)

mockReporter.write('result')
emitter.emit('run_complete', capturedBrowsers, {exitCode: 0})
})

it('should set the empty to 0 if empty results', (done) => {
capturedBrowsers.add(new Browser())
sinon.stub(capturedBrowsers, 'areAllReady', () => true)

response.once('end', () => {
expect(nextSpy).to.not.have.been.called
expect(response).to.beServedAs(200, 'result\x1FEXIT00')
done()
})

handler(new HttpRequestMock('/__run__'), response, nextSpy)

mockReporter.write('result')
