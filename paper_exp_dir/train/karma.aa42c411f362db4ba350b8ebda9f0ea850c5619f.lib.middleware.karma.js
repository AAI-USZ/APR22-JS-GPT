

var path = require('path')
var util = require('util')
var url = require('url')
var useragent = require('useragent')

var log = require('../logger').create('middleware:karma')

var urlparse = function (urlStr) {
var urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
}

var common = require('./common')

var VERSION = require('../constants').VERSION
var SCRIPT_TAG = '<script type="%s" src="%s" %s></script>'
var CROSSORIGIN_ATTRIBUTE = 'crossorigin="anonymous"'
var LINK_TAG_CSS = '<link type="text/css" href="%s" rel="stylesheet">'
var LINK_TAG_HTML = '<link href="%s" rel="import">'
var SCRIPT_TYPE = {
'.js': 'text/javascript',
'.dart': 'application/dart'
}

var filePathToUrlPath = function (filePath, basePath, urlRoot, proxyPath) {
if (filePath.indexOf(basePath) === 0) {
return proxyPath + urlRoot.substr(1) + 'base' + filePath.substr(basePath.length)
}

return proxyPath + urlRoot.substr(1) + 'absolute' + filePath
}

var getXUACompatibleMetaElement = function (url) {
var tag = ''
var urlObj = urlparse(url)
if (urlObj.query['x-ua-compatible']) {
tag = '\n<meta http-equiv="X-UA-Compatible" content="' +
urlObj.query['x-ua-compatible'] + '"/>'
}
return tag
}

var getXUACompatibleUrl = function (url) {
var value = ''
var urlObj = urlparse(url)
if (urlObj.query['x-ua-compatible']) {
value = '?x-ua-compatible=' + encodeURIComponent(urlObj.query['x-ua-compatible'])
}
return value
}

var isFirefox = function (req) {
if (!(req && req.headers)) {
return false
}


var firefox = useragent.is(req.headers['user-agent']).firefox

return firefox
}

var createKarmaMiddleware = function (
filesPromise,
serveStaticFile,
serveFile,
injector,
basePath,
urlRoot,
upstreamProxy
) {
var proxyPath = upstreamProxy ? upstreamProxy.path : '/'
return function (request, response, next) {

var client = injector.get('config.client')
var customContextFile = injector.get('config.customContextFile')
var customDebugFile = injector.get('config.customDebugFile')
var customClientContextFile = injector.get('config.customClientContextFile')
var jsVersion = injector.get('config.jsVersion')
var includeCrossOriginAttribute = injector.get('config.crossOriginAttribute')

var requestUrl = request.normalizedUrl.replace(/\?.*/, '')
var requestedRangeHeader = request.headers['range']


if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', proxyPath + urlRoot.substr(1))
response.writeHead(301)
