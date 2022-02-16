const path = require('path')
const httpMock = require('mocks').http
const loadFile = require('mocks').loadFile

describe('middleware.proxy', () => {
let requestedUrl
let response
let nextSpy
let type
let m = loadFile(path.join(__dirname, '/../../../lib/middleware/proxy.js'))

const mockProxies = [{
path: '/proxy',
baseUrl: '',
host: 'localhost',
port: '9000',
proxy: {
web: function (req, res) {
type = 'web'
requestedUrl = req.url
res.writeHead(200)
res.end('DONE')
},
ws: function (req, socket, head) {
type = 'ws'
requestedUrl = req.url
}
}
}, {
path: '/static',
baseUrl: '',
host: 'gstatic.com',
port: '80',
proxy: {
web: function (req, res) {
type = 'web'
requestedUrl = req.url
res.writeHead(200)
res.end('DONE')
},
ws: function (req, socket, head) {
type = 'ws'
requestedUrl = req.url
}
}
}, {
path: '/sub/some',
baseUrl: '/something',
host: 'gstatic.com',
port: '80',
proxy: {
web: function (req, res) {
type = 'web'
requestedUrl = req.url
res.writeHead(200)
res.end('DONE')
},
ws: function (req, socket, head) {
type = 'ws'
requestedUrl = req.url
}
}
}, {
path: '/sub',
baseUrl: '',
host: 'localhost',
port: '9000',
proxy: {
web: function (req, res) {
type = 'web'
requestedUrl = req.url
res.writeHead(200)
res.end('DONE')
},
ws: function (req, socket, head) {
type = 'ws'
requestedUrl = req.url
}
}
}]

beforeEach(() => {
requestedUrl = ''
type = ''
response = new httpMock.ServerResponse()
nextSpy = sinon.spy()
})

it('should proxy requests', (done) => {
const proxy = m.createProxyHandler(mockProxies, true, '/', {})
proxy(new httpMock.ServerRequest('/proxy/test.html'), response, nextSpy)

expect(nextSpy).not.to.have.been.called
expect(requestedUrl).to.equal('/test.html')
expect(type).to.equal('web')
done()
})

it('should proxy websocket requests', (done) => {
const proxy = m.createProxyHandler(mockProxies, true, '/', {})
proxy.upgrade(new httpMock.ServerRequest('/proxy/test.html'), response, nextSpy)

expect(nextSpy).not.to.have.been.called
expect(requestedUrl).to.equal('/test.html')
expect(type).to.equal('ws')
done()
})

it('should support multiple proxies', () => {
const proxy = m.createProxyHandler(mockProxies, true, '/', {})
proxy(new httpMock.ServerRequest('/static/test.html'), response, nextSpy)

expect(nextSpy).not.to.have.been.called
expect(requestedUrl).to.equal('/test.html')
expect(type).to.equal('web')
})

it('should handle nested proxies', () => {
const proxy = m.createProxyHandler(mockProxies, true, '/', {})
proxy(new httpMock.ServerRequest('/sub/some/Test.html'), response, nextSpy)

expect(nextSpy).not.to.have.been.called
expect(requestedUrl).to.equal('/something/Test.html')
expect(type).to.equal('web')
})

it('should call next handler if the path is not proxied', () => {
const proxy = m.createProxyHandler(mockProxies, true, '/', {})
proxy(new httpMock.ServerRequest('/non/proxy/test.html'), response, nextSpy)

expect(nextSpy).to.have.been.called
})

it('should call next handler if no proxy defined', () => {
const proxy = m.createProxyHandler({}, true, '/', {})
proxy(new httpMock.ServerRequest('/non/proxy/test.html'), response, nextSpy)

expect(nextSpy).to.have.been.called
})

it('should parse a simple proxy config', () => {
const parsedProxyConfig = m.parseProxyConfig(proxy, {})
expect(parsedProxyConfig).to.have.length(1)
expect(parsedProxyConfig[0]).to.containSubset({
host: 'localhost',
port: '8000',
baseUrl: '/',
path: '/base/',
https: false
})
expect(parsedProxyConfig[0].proxy).to.exist
})

it('should set default http port', () => {
const parsedProxyConfig = m.parseProxyConfig(proxy, {})
expect(parsedProxyConfig).to.have.length(1)
expect(parsedProxyConfig[0]).to.containSubset({
host: 'localhost',
port: '80',
baseUrl: '/',
path: '/base/',
https: false
})
expect(parsedProxyConfig[0].proxy).to.exist
})

it('should set default https port', () => {
