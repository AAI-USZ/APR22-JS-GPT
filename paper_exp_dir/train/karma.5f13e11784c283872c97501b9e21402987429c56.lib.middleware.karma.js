

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
injector,
basePath,
urlRoot,
upstreamProxy,
browserSocketTimeout
) {
const proxyPath = upstreamProxy ? upstreamProxy.path : '/'
return function (request, response, next) {

const client = injector.get('config.client')
