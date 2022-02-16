

const path = require('path')
const url = require('url')
const helper = require('../helper')

const log = require('../logger').create('middleware:karma')
const stripHost = require('./strip_host').stripHost
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
'module',
'dom'
]

function filePathToUrlPath (filePath, basePath, urlRoot, proxyPath) {
if (filePath.startsWith(basePath)) {
return proxyPath + urlRoot.substr(1) + 'base' + filePath.substr(basePath.length)
}
return proxyPath + urlRoot.substr(1) + 'absolute' + filePath
}

function getQuery (urlStr) {
return url.parse(urlStr, true).query || {}
}

function getXUACompatibleMetaElement (url) {
const query = getQuery(url)
if (query['x-ua-compatible']) {
return `\n<meta http-equiv="X-UA-Compatible" content="${query['x-ua-compatible']}"/>`
}
return ''
}

function getXUACompatibleUrl (url) {
const query = getQuery(url)
if (query['x-ua-compatible']) {
return '?x-ua-compatible=' + encodeURIComponent(query['x-ua-compatible'])
}
return ''
}

function createKarmaMiddleware (
filesPromise,
serveStaticFile,
serveFile,
readFilePromise,
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
return serveStaticFile('/client.html', requestedRangeHeader, response, (data) =>
data
.replace('\n%X_UA_COMPATIBLE%', getXUACompatibleMetaElement(request.url))
.replace('%X_UA_COMPATIBLE_URL%', getXUACompatibleUrl(request.url)))
}
}

if (['/karma.js', '/context.js', '/debug.js'].includes(requestUrl)) {
return serveStaticFile(requestUrl, requestedRangeHeader, response, (data) =>
data
.replace('%KARMA_URL_ROOT%', urlRoot)
.replace('%KARMA_VERSION%', VERSION)
.replace('%KARMA_PROXY_PATH%', proxyPath)
.replace('%BROWSER_SOCKET_TIMEOUT%', browserSocketTimeout))
}


if (requestUrl === '/favicon.ico') {
return serveStaticFile(requestUrl, requestedRangeHeader, response)
}



const isRequestingContextFile = requestUrl === '/context.html'
const isRequestingDebugFile = requestUrl === '/debug.html'
const isRequestingClientContextFile = requestUrl === '/client_with_context.html'
const includedContent = new Map()
if (isRequestingContextFile || isRequestingDebugFile || isRequestingClientContextFile) {
return filesPromise.then((files) => {

const contentReads = []
for (const file of files.included) {
const fileType = file.type || path.extname(file.path).substring(1)
if (fileType === 'dom') {
contentReads.push(
readFilePromise(file.path).then((content) => includedContent.set(file.path, content))
)
}
}
return Promise.all(contentReads).then(() => files)
}).then(function (files) {
let fileServer
let requestedFileUrl
log.debug('custom files', customContextFile, customDebugFile, customClientContextFile)
if (isRequestingContextFile && customContextFile) {
log.debug(`Serving customContextFile ${customContextFile}`)
fileServer = serveFile
requestedFileUrl = customContextFile
} else if (isRequestingDebugFile && customDebugFile) {
log.debug(`Serving customDebugFile ${customDebugFile}`)
fileServer = serveFile
requestedFileUrl = customDebugFile
} else if (isRequestingClientContextFile && customClientContextFile) {
log.debug(`Serving customClientContextFile ${customClientContextFile}`)
fileServer = serveFile
requestedFileUrl = customClientContextFile
} else {
log.debug(`Serving static request ${requestUrl}`)
fileServer = serveStaticFile
requestedFileUrl = requestUrl
}

fileServer(requestedFileUrl, requestedRangeHeader, response, function (data) {
common.setNoCacheHeaders(response)

const scriptTags = []
const scriptUrls = []
for (const file of files.included) {
let filePath = file.path
const fileType = file.type || path.extname(filePath).substring(1)

if (helper.isDefined(fileType) && !FILE_TYPES.includes(fileType)) {
}

if (!file.isUrl) {
filePath = filePathToUrlPath(filePath, basePath, urlRoot, proxyPath)

if (requestUrl === '/context.html') {
filePath += '?' + file.sha
}
}

scriptUrls.push(filePath)

if (fileType === 'css') {
scriptTags.push(`<link type="text/css" href="${filePath}" rel="stylesheet">`)
} else if (fileType === 'dom') {
scriptTags.push(includedContent.get(file.path))
} else if (fileType === 'html') {
scriptTags.push(`<link href="${filePath}" rel="import">`)
} else {
const scriptType = (SCRIPT_TYPE[fileType] || 'text/javascript')
const crossOriginAttribute = includeCrossOriginAttribute ? 'crossorigin="anonymous"' : ''
scriptTags.push(`<script type="${scriptType}" src="${filePath}" ${crossOriginAttribute}></script>`)
}
}

const mappings = data.includes('%MAPPINGS%') ? files.served.map((file) => {
const filePath = filePathToUrlPath(file.path, basePath, urlRoot, proxyPath)
.replace(/\\/g, '\\\\')
.replace(/'/g, '\\\'')

return `  '${filePath}': '${file.sha}'`
}) : []

return data
.replace('%SCRIPTS%', scriptTags.join('\n'))
.replace('%CLIENT_CONFIG%', 'window.__karma__.config = ' + JSON.stringify(client) + ';\n')
.replace('%SCRIPT_URL_ARRAY%', 'window.__karma__.scriptUrls = ' + JSON.stringify(scriptUrls) + ';\n')
.replace('%MAPPINGS%', 'window.__karma__.files = {\n' + mappings.join(',\n') + '\n};\n')
.replace('\n%X_UA_COMPATIBLE%', getXUACompatibleMetaElement(request.url))
})
})
} else if (requestUrl === '/context.json') {
return filesPromise.then((files) => {
common.setNoCacheHeaders(response)
response.writeHead(200)
response.end(JSON.stringify({
files: files.included.map((file) => filePathToUrlPath(file.path + '?' + file.sha, basePath, urlRoot, proxyPath))
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
'readFilePromise',
'injector',
'config.basePath',
'config.urlRoot',
'config.upstreamProxy',
'config.browserSocketTimeout'
]


exports.create = createKarmaMiddleware
