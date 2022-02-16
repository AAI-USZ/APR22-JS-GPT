var url = require('url')
var httpProxy = require('http-proxy')

var log = require('../logger').create('proxy')
var _ = require('../helper')._

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
