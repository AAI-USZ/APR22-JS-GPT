var path = require('path')
var EventEmitter = require('events').EventEmitter
var mocks = require('mocks')
var Promise = require('bluebird')
var _ = require('lodash')

var Browser = require('../../../lib/browser')
var BrowserCollection = require('../../../lib/browser_collection')
var MultReporter = require('../../../lib/reporters/multi')
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
