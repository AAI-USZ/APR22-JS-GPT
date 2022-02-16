

const path = require('path')
const url = require('url')
const _ = require('lodash')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost

function urlparse (urlStr) {
const urlObj = url.parse(urlStr, true)
urlObj.query = urlObj.query || {}
return urlObj
}

const common = require('./common')

const VERSION = require('../constants').VERSION
const SCRIPT_TYPE = {
'js': 'text/javascript',
'dart': 'application/dart',
'module': 'module'
}
const FILE_TYPES = [
'css',
'html',
'js',
'dart',
'module'
]

function filePathToUrlPath (filePath, basePath, urlRoot, proxyPath) {
if (filePath.startsWith(basePath)) {
return proxyPath + urlRoot.substr(1) + 'base' + filePath.substr(basePath.length)
}

return proxyPath + urlRoot.substr(1) + 'absolute' + filePath
}

function getXUACompatibleMetaElement (url) {
let tag = ''
const urlObj = urlparse(url)
if (urlObj.query['x-ua-compatible']) {
tag = '\n<meta http-equiv="X-UA-Compatible" content="' +
urlObj.query['x-ua-compatible'] + '"/>'
}
return tag
}

function getXUACompatibleUrl (url) {
let value = ''
const urlObj = urlparse(url)
if (urlObj.query['x-ua-compatible']) {
value = '?x-ua-compatible=' + encodeURIComponent(urlObj.query['x-ua-compatible'])
}
return value
}

function createKarmaMiddleware (
filesPromise,
serveStaticFile,
serveFile,
injector,
basePath,
urlRoot,
upstreamProxy,
browserSocketTimeout
) {
const proxyPath = upstreamProxy ? upstreamProxy.path : '/'
return function (request, response, next) {

const client = injector.get('config.client')
const customContextFile = injector.get('config.customContextFile')
const customDebugFile = injector.get('config.customDebugFile')
const customClientContextFile = injector.get('config.customClientContextFile')
const includeCrossOriginAttribute = injector.get('config.crossOriginAttribute')

const normalizedUrl = stripHost(request.url) || request.url

request.normalizedUrl = normalizedUrl

let requestUrl = normalizedUrl.replace(/\?.*/, '')
const requestedRangeHeader = request.headers['range']


if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', proxyPath + urlRoot.substr(1))
response.writeHead(301)
return response.end('MOVED PERMANENTLY')
}


if (!requestUrl.startsWith(urlRoot)) {
return next()
}


requestUrl = requestUrl.substr(urlRoot.length - 1)


if (requestUrl === '/') {

if (!client.useIframe && client.runInParent) {
requestUrl = '/client_with_context.html'
} else {
return serveStaticFile('/client.html', requestedRangeHeader, response, function (data) {
return data
.replace('\n%X_UA_COMPATIBLE%', getXUACompatibleMetaElement(request.url))
.replace('%X_UA_COMPATIBLE_URL%', getXUACompatibleUrl(request.url))
})
}
}

if (['/karma.js', '/context.js', '/debug.js'].includes(requestUrl)) {
return serveStaticFile(requestUrl, requestedRangeHeader, response, function (data) {
return data.replace('%KARMA_URL_ROOT%', urlRoot)
.replace('%KARMA_VERSION%', VERSION)
.replace('%KARMA_PROXY_PATH%', proxyPath)
.replace('%BROWSER_SOCKET_TIMEOUT%', browserSocketTimeout)
})
}
