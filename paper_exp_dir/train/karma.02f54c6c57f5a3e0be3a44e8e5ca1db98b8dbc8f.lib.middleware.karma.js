

var path = require('path')
var util = require('util')
var url = require('url')
var _ = require('lodash')

var log = require('../logger').create('middleware:karma')

function urlparse (urlStr) {
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
'js': 'text/javascript',
'dart': 'application/dart',
'module': 'module'
}
var FILE_TYPES = [
'css',
'html',
'js',
'dart',
'module'
]

function filePathToUrlPath (filePath, basePath, urlRoot, proxyPath) {
if (filePath.indexOf(basePath) === 0) {
return proxyPath + urlRoot.substr(1) + 'base' + filePath.substr(basePath.length)
}

return proxyPath + urlRoot.substr(1) + 'absolute' + filePath
}

function getXUACompatibleMetaElement (url) {
var tag = ''
var urlObj = urlparse(url)
if (urlObj.query['x-ua-compatible']) {
tag = '\n<meta http-equiv="X-UA-Compatible" content="' +
urlObj.query['x-ua-compatible'] + '"/>'
}
return tag
}

function getXUACompatibleUrl (url) {
var value = ''
var urlObj = urlparse(url)
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
upstreamProxy
) {
var proxyPath = upstreamProxy ? upstreamProxy.path : '/'
return function (request, response, next) {

var client = injector.get('config.client')
var customContextFile = injector.get('config.customContextFile')
var customDebugFile = injector.get('config.customDebugFile')
var customClientContextFile = injector.get('config.customClientContextFile')
var includeCrossOriginAttribute = injector.get('config.crossOriginAttribute')

var requestUrl = request.normalizedUrl.replace(/\?.*/, '')
var requestedRangeHeader = request.headers['range']


if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', proxyPath + urlRoot.substr(1))
response.writeHead(301)
return response.end('MOVED PERMANENTLY')
}


if (requestUrl.indexOf(urlRoot) !== 0) {
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


var jsFiles = ['/karma.js', '/context.js', '/debug.js']
var isRequestingJsFile = jsFiles.indexOf(requestUrl) !== -1
if (isRequestingJsFile) {
return serveStaticFile(requestUrl, requestedRangeHeader, response, function (data) {
return data.replace('%KARMA_URL_ROOT%', urlRoot)
.replace('%KARMA_VERSION%', VERSION)
.replace('%KARMA_PROXY_PATH%', proxyPath)
})
}


if (requestUrl === '/favicon.ico') {
return serveStaticFile(requestUrl, requestedRangeHeader, response)
}



var isRequestingContextFile = requestUrl === '/context.html'
var isRequestingDebugFile = requestUrl === '/debug.html'
var isRequestingClientContextFile = requestUrl === '/client_with_context.html'
if (isRequestingContextFile || isRequestingDebugFile || isRequestingClientContextFile) {
return filesPromise.then(function (files) {
var fileServer
var requestedFileUrl
log.debug('custom files', customContextFile, customDebugFile, customClientContextFile)
if (isRequestingContextFile && customContextFile) {
log.debug('Serving customContextFile %s', customContextFile)
fileServer = serveFile
requestedFileUrl = customContextFile
} else if (isRequestingDebugFile && customDebugFile) {
log.debug('Serving customDebugFile %s', customDebugFile)
fileServer = serveFile
requestedFileUrl = customDebugFile
} else if (isRequestingClientContextFile && customClientContextFile) {
log.debug('Serving customClientContextFile %s', customClientContextFile)
fileServer = serveFile
requestedFileUrl = customClientContextFile
} else {
log.debug('Serving static request %s', requestUrl)
fileServer = serveStaticFile
requestedFileUrl = requestUrl
}

fileServer(requestedFileUrl, requestedRangeHeader, response, function (data) {
common.setNoCacheHeaders(response)

var scriptTags = []
var scriptUrls = []
for (var i = 0; i < files.included.length; i++) {
var file = files.included[i]
var filePath = file.path
var fileExt = path.extname(filePath)
var fileType = file.type

if (!files.included.hasOwnProperty(i)) {
continue
}

if (!_.isUndefined(fileType) && FILE_TYPES.indexOf(fileType) === -1) {
log.warn('Invalid file type, defaulting to js.', fileType)
}

if (!file.isUrl) {
filePath = filePathToUrlPath(filePath, basePath, urlRoot, proxyPath)

if (requestUrl === '/context.html') {
filePath += '?' + file.sha
}
}

scriptUrls.push(filePath)

if (fileType === 'css' || (!fileType && fileExt === '.css')) {
scriptTags.push(util.format(LINK_TAG_CSS, filePath))
continue
}

if (fileType === 'html' || (!fileType && fileExt === '.html')) {
scriptTags.push(util.format(LINK_TAG_HTML, filePath))
continue
}


var scriptFileType = (fileType || fileExt.substring(1))
var scriptType = (SCRIPT_TYPE[scriptFileType] || 'text/javascript')

var crossOriginAttribute = includeCrossOriginAttribute ? CROSSORIGIN_ATTRIBUTE : ''
scriptTags.push(util.format(SCRIPT_TAG, scriptType, filePath, crossOriginAttribute))
}


var mappings = files.served.map(function (file) {

var filePath = filePathToUrlPath(file.path, basePath, urlRoot, proxyPath).replace(/\\/g, '\\\\')


filePath = filePath.replace(/'/g, '\\\'')

return util.format("  '%s': '%s'", filePath, file.sha)
})

var clientConfig = 'window.__karma__.config = ' + JSON.stringify(client) + ';\n'

var scriptUrlsJS = 'window.__karma__.scriptUrls = ' + JSON.stringify(scriptUrls) + ';\n'

mappings = 'window.__karma__.files = {\n' + mappings.join(',\n') + '\n};\n'

return data
.replace('%SCRIPTS%', scriptTags.join('\n'))
.replace('%CLIENT_CONFIG%', clientConfig)
.replace('%SCRIPT_URL_ARRAY%', scriptUrlsJS)
.replace('%MAPPINGS%', mappings)
.replace('\n%X_UA_COMPATIBLE%', getXUACompatibleMetaElement(request.url))
})
})
} else if (requestUrl === '/context.json') {
return filesPromise.then(function (files) {
common.setNoCacheHeaders(response)
response.writeHead(200)
response.end(JSON.stringify({
files: files.included.map(function (file) {
return filePathToUrlPath(file.path + '?' + file.sha, basePath, urlRoot, proxyPath)
})
}))
})
