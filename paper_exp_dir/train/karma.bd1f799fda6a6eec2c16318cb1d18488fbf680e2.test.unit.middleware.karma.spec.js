var mocks = require('mocks')

var helper = require('../../../lib/helper')
var constants = require('../../../lib/constants')
var File = require('../../../lib/file')
var Url = require('../../../lib/url')

var HttpResponseMock = mocks.http.ServerResponse
var HttpRequestMock = mocks.http.ServerRequest

describe('middleware.karma', () => {
var serveFile
var filesDeferred
var nextSpy
var response

var MockFile = function (path, sha, type) {
File.call(this, path, undefined, undefined, type)
this.sha = sha || 'sha-default'
}

var fsMock = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML\n%X_UA_COMPATIBLE%%X_UA_COMPATIBLE_URL%'),
'context.html': mocks.fs.file(0, 'CONTEXT\n%SCRIPTS%'),
'debug.html': mocks.fs.file(0, 'DEBUG\n%SCRIPTS%\n%X_UA_COMPATIBLE%'),
'karma.js': mocks.fs.file(0, 'root: %KARMA_URL_ROOT%, proxy: %KARMA_PROXY_PATH%, v: %KARMA_VERSION%')
}
}
})

var createServeFile = require('../../../lib/middleware/common').createServeFile
var createKarmaMiddleware = require('../../../lib/middleware/karma').create

var handler = serveFile = filesDeferred = nextSpy = response = null

var clientConfig = {
foo: 'bar'
}
var injector = {
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
'/base/path',
'/__karma__/',
{path: '/__proxy__/'}
)
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
expect(response._headers['Location']).to.equal('/__proxy__/__karma__/')
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
handler = createKarmaMiddleware(
null,
serveFile,
null,
injector,
'/base',
'/'
)

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CLIENT HTML')
done()
})

callHandlerWith('/')
})

it('should serve /?id=xxx', (done) => {
handler = createKarmaMiddleware(
null,
serveFile,
null,
injector,
'/base',
'/'
)

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CLIENT HTML')
done()
})

callHandlerWith('/?id=123')
})

it('should serve /?x-ua-compatible with replaced values', (done) => {
handler = createKarmaMiddleware(
null,
serveFile,
null,
injector,
'/base',
'/'
)

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CLIENT HTML\n<meta http-equiv="X-UA-Compatible" content="xxx=yyy"/>?x-ua-compatible=xxx%3Dyyy')
done()
})

callHandlerWith('/?x-ua-compatible=xxx%3Dyyy')
})

it('should serve debug.html/?x-ua-compatible with replaced values', (done) => {
includedFiles([])

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'DEBUG\n\n<meta http-equiv="X-UA-Compatible" content="xxx=yyy"/>')
done()
})

callHandlerWith('/__karma__/debug.html?x-ua-compatible=xxx%3Dyyy')
})

it('should serve karma.js with version and urlRoot variables', (done) => {
response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'root: /__karma__/, proxy: /__proxy__/, v: ' + constants.VERSION)
expect(response._headers['Content-Type']).to.equal('application/javascript')
done()
})

callHandlerWith('/__karma__/karma.js')
})

it('should serve context.html with replaced script tags', (done) => {
includedFiles([
new MockFile('/first.js', 'sha123'),
new MockFile('/second.dart', 'sha456')
])

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CONTEXT\n<script type="text/javascript" src="/__proxy__/__karma__/absolute/first.js?sha123" crossorigin="anonymous"></script>\n<script type="application/dart" src="/__proxy__/__karma__/absolute/second.dart?sha456" crossorigin="anonymous"></script>')
done()
})

callHandlerWith('/__karma__/context.html')
})

it('should serve context.html with replaced link tags', (done) => {
includedFiles([
new MockFile('/first.css', 'sha007'),
new MockFile('/second.html', 'sha678'),
new MockFile('/third', 'sha111', 'css'),
new MockFile('/fourth', 'sha222', 'html'),
new Url('http://some.url.com/fifth', 'css'),
new Url('http://some.url.com/sixth', 'html')
])

response.once('end', () => {
expect(nextSpy).not.to.have.been.called
expect(response).to.beServedAs(200, 'CONTEXT\n<link type="text/css" href="/__proxy__/__karma__/absolute/first.css?sha007" rel="stylesheet">\n<link href="/__proxy__/__karma__/absolute/second.html?sha678" rel="import">\n<link type="text/css" href="/__proxy__/__karma__/absolute/third?sha111" rel="stylesheet">\n<link href="/__proxy__/__karma__/absolute/fourth?sha222" rel="import">\n<link type="text/css" href="http://some.url.com/fifth" rel="stylesheet">\n<link href="http://some.url.com/sixth" rel="import">')
done()
})
