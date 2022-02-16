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

return _.sortBy(_.map(proxies, function (proxyUrl, proxyPath) {
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
var port = proxyDetails.port || config.port ||
(proxyDetails.protocol === 'https:' ? '443' : '80')
var https = proxyDetails.protocol === 'https:'

var proxy = httpProxy.createProxyServer({
target: {
host: hostname,
port: port,
https: https,
