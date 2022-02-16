

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

if (!files.included.hasOwnProperty(i)) {
continue
}

if (!file.isUrl) {
filePath = filePathToUrlPath(filePath, basePath, urlRoot, proxyPath)

if (requestUrl === '/context.html') {
filePath += '?' + file.sha
}
}

scriptUrls.push(filePath)

if (fileExt === '.css') {
scriptTags.push(util.format(LINK_TAG_CSS, filePath))
continue
}

if (fileExt === '.html') {
scriptTags.push(util.format(LINK_TAG_HTML, filePath))
continue
}


var scriptType = (SCRIPT_TYPE[fileExt] || 'text/javascript')


if (jsVersion && jsVersion > 0 && isFirefox(request)) {
scriptType += ';version=' + jsVersion
}

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
}, function (errorFiles) {
serveStaticFile(requestUrl, response, function (data) {
common.setNoCacheHeaders(response)
return data.replace('%SCRIPTS%', '').replace('%CLIENT_CONFIG%', '').replace('%MAPPINGS%',
'window.__karma__.error("TEST RUN WAS CANCELLED because ' +
(errorFiles.length > 1 ? 'these files contain' : 'this file contains') +
' some errors:\\n  ' + errorFiles.join('\\n  ') + '");')
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
}

return next()
}
}

createKarmaMiddleware.$inject = [
'filesPromise',
'serveStaticFile',
'serveFile',
'injector',
'config.basePath',
'config.urlRoot',
'config.upstreamProxy'
]


exports.create = createKarmaMiddleware
