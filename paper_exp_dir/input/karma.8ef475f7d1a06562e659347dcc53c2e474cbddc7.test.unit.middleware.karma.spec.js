import helper from '../../../lib/helper'
import constants from '../../../lib/constants'
import File from '../../../lib/file'
import Url from '../../../lib/url'
import mocks from 'mocks'

var HttpResponseMock = mocks.http.ServerResponse
var HttpRequestMock = mocks.http.ServerRequest

describe('middleware.karma', () => {
var serveFile
var filesDeferred
var nextSpy
var response

var MockFile = function (path, sha) {
File.call(this, path)
this.sha = sha || 'sha-default'
}

var fsMock = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML\n%X_UA_COMPATIBLE%%X_UA_COMPATIBLE_URL%'),
'context.html': mocks.fs.file(0, 'CONTEXT\n%SCRIPTS%'),
'debug.html': mocks.fs.file(0, 'DEBUG\n%SCRIPTS%\n%X_UA_COMPATIBLE%'),
'karma.js': mocks.fs.file(0, 'root: %KARMA_URL_ROOT%, v: %KARMA_VERSION%')
}
}
})

var createServeFile = require('../../../lib/middleware/common').createServeFile
var createKarmaMiddleware = require('../../../lib/middleware/karma').create

var handler = serveFile = filesDeferred = nextSpy = response = null

