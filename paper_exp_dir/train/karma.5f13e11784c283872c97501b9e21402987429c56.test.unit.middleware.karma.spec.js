'use strict'

const mocks = require('mocks')

const helper = require('../../../lib/helper')
const constants = require('../../../lib/constants')
const File = require('../../../lib/file')
const Url = require('../../../lib/url')

const HttpResponseMock = mocks.http.ServerResponse
const HttpRequestMock = mocks.http.ServerRequest

describe('middleware.karma', () => {
let serveFile
let filesDeferred
let nextSpy
let response

class MockFile extends File {
constructor (path, sha, type, content) {
super(path, undefined, undefined, type)
this.sha = sha || 'sha-default'
this.content = content
}
}

const fsMock = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML\n%X_UA_COMPATIBLE%%X_UA_COMPATIBLE_URL%'),
'context.html': mocks.fs.file(0, 'CONTEXT\n%SCRIPTS%'),
'debug.html': mocks.fs.file(0, 'DEBUG\n%SCRIPTS%\n%X_UA_COMPATIBLE%'),
'karma.js': mocks.fs.file(0, 'root: %KARMA_URL_ROOT%, proxy: %KARMA_PROXY_PATH%, v: %KARMA_VERSION%')
}
}
})

const createServeFile = require('../../../lib/middleware/common').createServeFile
const createKarmaMiddleware = require('../../../lib/middleware/karma').create
let handler = serveFile = filesDeferred = nextSpy = response = null

const clientConfig = {
foo: 'bar'
}
const injector = {
get (val) {
switch (val) {
case 'config.client':
return clientConfig
case 'config.crossOriginAttribute':
return true
default:
return null
}
}
}

beforeEach(() => {
nextSpy = sinon.spy()
response = new HttpResponseMock()
filesDeferred = helper.defer()
serveFile = createServeFile(fsMock, '/karma/static')
handler = createKarmaMiddleware(
filesDeferred.promise,
serveFile,
null,
injector,
