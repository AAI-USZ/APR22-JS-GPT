const http = require('http')
const httpProxy = require('http-proxy')

function Proxy () {
const self = this
self.running = false

self.proxy = httpProxy.createProxyServer({
target: 'http://localhost:9876'
})

self.proxy.on('error', function proxyError (err, req, res) {
console.log('support/proxy onerror', err)
})

self.server = http.createServer(function (req, res) {
const url = req.url
const match = url.match(self.proxyPathRegExp)
if (match) {
req.url = '/' + match[1]
self.proxy.web(req, res)
