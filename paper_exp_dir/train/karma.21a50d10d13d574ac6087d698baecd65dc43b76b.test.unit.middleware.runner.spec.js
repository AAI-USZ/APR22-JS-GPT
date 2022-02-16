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
