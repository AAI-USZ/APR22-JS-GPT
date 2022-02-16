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

beforeEach(() => {
var clientConfig = {foo: 'bar'}
nextSpy = sinon.spy()
response = new HttpResponseMock()
filesDeferred = helper.defer()
serveFile = createServeFile(fsMock, '/karma/static')
})


var includedFiles = (files) => {
return filesDeferred.resolve({included: files, served: []})
}

var servedFiles = (files) => {
return filesDeferred.resolve({included: [], served: files})
}

var normalizedHttpRequest = (urlPath) => {
var req = new HttpRequestMock(urlPath)
req.normalizedUrl = req.url
return req
}

var callHandlerWith = function (urlPath, next) {
var promise = handler(normalizedHttpRequest(urlPath), response, next || nextSpy)
if (promise && promise.done) promise.done()
}

it('should redirect urlRoot without trailing slash', (done) => {
response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(301, 'MOVED PERMANENTLY')
expect(response._headers['Location']).to.equal('/__karma__/')
done()
})

callHandlerWith('/__karma__')
})

it('should not serve outside of urlRoot', () => {
handler(normalizedHttpRequest('/'), null, nextSpy)
expect(nextSpy).to.have.been.called
nextSpy.reset()

handler(normalizedHttpRequest('/client.html'), null, nextSpy)
expect(nextSpy).to.have.been.called
nextSpy.reset()

handler(normalizedHttpRequest('/debug.html'), null, nextSpy)
expect(nextSpy).to.have.been.called
nextSpy.reset()

handler(normalizedHttpRequest('/context.html'), null, nextSpy)
expect(nextSpy).to.have.been.called
})

it('should serve client.html', (done) => {

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CLIENT HTML')
done()
})

callHandlerWith('/')
})

it('should serve /?id=xxx', (done) => {
