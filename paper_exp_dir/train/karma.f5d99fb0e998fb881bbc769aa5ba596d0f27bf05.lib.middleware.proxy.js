var url = require('url')
var httpProxy = require('http-proxy')
var _ = require('lodash')

var log = require('../logger').create('proxy')

var parseProxyConfig = function (proxies, config) {
var endsWithSlash = function (str) {
return str.substr(-1) === '/'
}

if (!proxies) {
return []
}

return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
if (typeof proxyConfiguration === 'string') {
proxyConfiguration = {target: proxyConfiguration}
}
var proxyUrl = proxyConfiguration.target
var proxyDetails = url.parse(proxyUrl)
var pathname = proxyDetails.pathname



if (endsWithSlash(proxyPath) && !endsWithSlash(proxyUrl)) {
log.warn('proxy "%s" normalized to "%s"', proxyUrl, proxyUrl + '/')
proxyUrl += '/'
pathname += '/'
}

if (!endsWithSlash(proxyPath) && endsWithSlash(proxyUrl)) {
log.warn('proxy "%s" normalized to "%s"', proxyPath, proxyPath + '/')
proxyPath += '/'
}

if (pathname === '/' && !endsWithSlash(proxyUrl)) {
pathname = ''
}

var hostname = proxyDetails.hostname || config.hostname
var protocol = proxyDetails.protocol || config.protocol
var https = proxyDetails.protocol === 'https:'
var port
if (proxyDetails.port) {
port = proxyDetails.port
} else if (proxyDetails.protocol) {
port = proxyDetails.protocol === 'https:' ? '443' : '80'
} else {
port = config.port
}
var changeOrigin = 'changeOrigin' in proxyConfiguration ? proxyConfiguration.changeOrigin : false
var proxy = httpProxy.createProxyServer({
target: {
host: hostname,
port: port,
https: https,
protocol: protocol
},
xfwd: true,
changeOrigin: changeOrigin,
secure: config.proxyValidateSSL
})

;['proxyReq', 'proxyRes'].forEach(function (name) {
var callback = proxyDetails[name] || config[name]
if (callback) {
proxy.on(name, callback)
}
})

proxy.on('error', function proxyError (err, req, res) {
if (err.code === 'ECONNRESET' && req.socket.destroyed) {
log.debug('failed to proxy %s (browser hung up the socket)', req.url)
} else {
