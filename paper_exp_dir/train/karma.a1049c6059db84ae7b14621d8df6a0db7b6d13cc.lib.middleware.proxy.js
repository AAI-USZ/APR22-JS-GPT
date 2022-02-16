const url = require('url')
const httpProxy = require('http-proxy')
const _ = require('lodash')

const log = require('../logger').create('proxy')

function parseProxyConfig (proxies, config) {
proxies = proxies || []
return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
if (typeof proxyConfiguration === 'string') {
proxyConfiguration = { target: proxyConfiguration }
}
let proxyUrl = proxyConfiguration.target

const proxyDetails = url.parse(proxyUrl)
let pathname = proxyDetails.pathname

if (proxyPath.endsWith('/') && !proxyUrl.endsWith('/')) {
log.warn(`proxy "${proxyUrl}" normalized to "${proxyUrl}/"`)
proxyUrl += '/'
pathname += '/'
}
