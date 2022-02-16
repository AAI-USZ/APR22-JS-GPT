'use strict'

const querystring = require('querystring')
const common = require('./common')

const log = require('../logger').create('middleware:source-files')

function findByPath (files, path) {
return Array.from(files).find((file) => file.path === path)
}

function composeUrl (url, basePath, urlRoot) {
return url
.replace(urlRoot, '/')
.replace(/\?.*$/, '')
.replace(/^\/absolute/, '')
.replace(/^\/base/, basePath)
}


function createSourceFilesMiddleware (filesPromise, serveFile, basePath, urlRoot) {
return function (request, response, next) {
const requestedFilePath = composeUrl(request.url, basePath, urlRoot)

const requestedFilePathUnescaped = composeUrl(querystring.unescape(request.url), basePath, urlRoot)

request.pause()

log.debug(`Requesting ${request.url}`)
log.debug(`Fetching ${requestedFilePath}`)

return filesPromise.then(function (files) {

const file = findByPath(files.served, requestedFilePath) || findByPath(files.served, requestedFilePathUnescaped)
const rangeHeader = request.headers.range

if (file) {
const acceptEncodingHeader = request.headers['accept-encoding']
const matchedEncoding = Object.keys(file.encodings).find(
(encoding) => new RegExp(`(^|.*, ?)${encoding}(,|$)`).test(acceptEncodingHeader)
)
const content = file.encodings[matchedEncoding] || file.content

serveFile(file.contentPath || file.path, rangeHeader, response, function () {
if (/\?\w+/.test(request.url)) {
common.setHeavyCacheHeaders(response)
} else {
common.setNoCacheHeaders(response)
}
if (matchedEncoding) {
response.setHeader('Content-Encoding', matchedEncoding)
}
}, content, file.doNotCache)
} else {
next()
}

request.resume()
})
}
}

createSourceFilesMiddleware.$inject = [
'filesPromise', 'serveFile', 'config.basePath', 'config.urlRoot'
]

exports.create = createSourceFilesMiddleware
