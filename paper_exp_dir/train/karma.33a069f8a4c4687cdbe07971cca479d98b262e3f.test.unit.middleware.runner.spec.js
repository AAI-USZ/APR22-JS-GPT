const path = require('path')
const EventEmitter = require('events').EventEmitter
const mocks = require('mocks')
const _ = require('lodash')

const Browser = require('../../../lib/browser')
const BrowserCollection = require('../../../lib/browser_collection')
const MultReporter = require('../../../lib/reporters/multi')
const createRunnerMiddleware = require('../../../lib/middleware/runner').create

const HttpResponseMock = mocks.http.ServerResponse
const HttpRequestMock = mocks.http.ServerRequest

