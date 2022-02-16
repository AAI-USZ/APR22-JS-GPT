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



