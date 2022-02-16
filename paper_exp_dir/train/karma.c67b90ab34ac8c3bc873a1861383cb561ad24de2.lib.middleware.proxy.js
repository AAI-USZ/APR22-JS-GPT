const url = require('url')
const httpProxy = require('http-proxy')
const _ = require('lodash')

const log = require('../logger').create('proxy')

function parseProxyConfig (proxies, config) {
function endsWithSlash (str) {
return str.substr(-1) === '/'
}

if (!proxies) {
return []
}

return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
if (typeof proxyConfiguration === 'string') {
proxyConfiguration = {target: proxyConfiguration}
}
let proxyUrl = proxyConfiguration.target
const proxyDetails = url.parse(proxyUrl)
let pathname = proxyDetails.pathname



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

const hostname = proxyDetails.hostname || config.hostname
const protocol = proxyDetails.protocol || config.protocol
const https = proxyDetails.protocol === 'https:'
