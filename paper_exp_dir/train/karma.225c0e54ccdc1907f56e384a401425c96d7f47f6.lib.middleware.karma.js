

var path = require('path')
var util = require('util')
var url = require('url')

var urlparse = function (urlStr) {
var urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
}

var common = require('./common')

var VERSION = require('../constants').VERSION
var SCRIPT_TAG = '<script type="%s" src="%s"></script>'
var LINK_TAG_CSS = '<link type="text/css" href="%s" rel="stylesheet">'
var LINK_TAG_HTML = '<link href="%s" rel="import">'
var SCRIPT_TYPE = {
'.js': 'text/javascript',
'.dart': 'application/dart'
}

var filePathToUrlPath = function (filePath, basePath, urlRoot) {
if (filePath.indexOf(basePath) === 0) {
return urlRoot + 'base' + filePath.substr(basePath.length)
}

return urlRoot + 'absolute' + filePath
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

var createKarmaMiddleware = function (filesPromise, serveStaticFile, serveFile,
basePath,   urlRoot,   client,
customContextFile,   customDebugFile) {
return function (request, response, next) {
var requestUrl = request.normalizedUrl.replace(/\?.*/, '')


if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', urlRoot)
response.writeHead(301)
return response.end('MOVED PERMANENTLY')
